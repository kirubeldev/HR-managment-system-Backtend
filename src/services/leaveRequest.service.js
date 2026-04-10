const { LeaveRequest, Employee, Role, sequelize } = require('../models');
const { generateDisplayId } = require('../utils/idGenerator');
const { Op } = require('sequelize');

class LeaveRequestService {
    async getAll(query = {}) {
        const { status, employeeId, branch, leaveType, search, limit = 10, page = 1, sortField = 'createdAt', sortOrder = 'DESC' } = query;
        const where = {};

        if (status) where.status = status;
        if (employeeId) where.employeeId = employeeId;
        if (leaveType && leaveType !== 'all') where.leaveType = leaveType;
        
        const andConditions = [];

        if (search) {
            andConditions.push({
                [Op.or]: [
                    { displayId: { [Op.iLike]: `%${search}%` } },
                    { reason: { [Op.iLike]: `%${search}%` } },
                    { '$employee.firstName$': { [Op.iLike]: `%${search}%` } },
                    { '$employee.lastName$': { [Op.iLike]: `%${search}%` } }
                ]
            });
        }
        
        const includeOptions = [
            {
                model: Employee,
                as: 'employee',
                attributes: ['id', 'firstName', 'lastName', 'profileImageUrl', 'position', 'branch']
            }
        ];

        // Handle branch filtering
        if (branch) {
            if (query.allowNullBranch) {
                // For non-admin users, include both direct branch matches and null branches
                andConditions.push({
                    [Op.or]: [{ branch: branch }, { branch: null }]
                });
            } else {
                // For admin users, filter by employee branch when leave branch is null
                includeOptions[0].where = {
                    branch: branch
                };
                // Include leave requests that have the branch set directly OR have null branch but employee (filtered above) has the branch
                andConditions.push({
                    [Op.or]: [
                        { branch: branch },
                        { branch: null }
                    ]
                });
            }
        }

        if (andConditions.length > 0) {
            where[Op.and] = andConditions;
        }

        // If limit=0, return all records without pagination
        const shouldPaginate = limit !== '0' && limit !== 0;
        
        // Determine sort
        const validSortFields = ['createdAt', 'startDate', 'endDate', 'status', 'leaveType'];
        const actualSortField = validSortFields.includes(sortField) ? sortField : 'createdAt';
        const actualSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        console.log('Leave sort params:', { sortField, sortOrder, actualSortField, actualSortOrder });

        // Default: sort by "nearest to NOW()" so today's real records appear first,
        // even if older seeded records have future createdAt dates.
        // When user explicitly sorts by createdAt ASC/DESC, use plain column sort.
        let orderClause;
        if (actualSortField === 'createdAt') {
            // Sort by absolute distance from NOW() — closest date to today first
            orderClause = [
                [sequelize.literal(`ABS(EXTRACT(EPOCH FROM ("LeaveRequest"."createdAt" - NOW())))`), 'ASC']
            ];
        } else {
            orderClause = [[actualSortField, actualSortOrder]];
        }
        
        const queryOptions = {
            where,
            include: includeOptions,
            order: orderClause
        };
        
        console.log('Final Order Clause:', JSON.stringify(orderClause, null, 2));
        
        if (shouldPaginate) {
            queryOptions.limit = Number(limit);
            queryOptions.offset = (page - 1) * limit;
        }

        console.log('Sequelize query options:', JSON.stringify(queryOptions, null, 2));
        const leaves = await LeaveRequest.findAll(queryOptions);
        console.log('First 3 leaves createdAt:', leaves.slice(0, 3).map(l => l.createdAt));
        
        // Use count with the same include options if they contain filters
        const countOptions = { where };
        if (includeOptions[0].where) {
            countOptions.include = includeOptions;
            countOptions.distinct = true; // Use distinct to count primary records only
        }
        const count = await LeaveRequest.count(countOptions);

        return shouldPaginate 
            ? { total: count, page: Number(page), limit: Number(limit), data: leaves }
            : { total: count, data: leaves };
    }

    async getById(id) {
        const leave = await LeaveRequest.findByPk(id, {
            include: [
                {
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'lastName', 'profileImageUrl', 'position', 'branch'],
                    include: [
                        {
                            model: Role,
                            as: 'role',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });
        if (!leave) throw new Error('Leave request not found');
        return leave;
    }

    async create(data) {
        const employee = await Employee.findByPk(data.employeeId);
        const branch = employee ? employee.branch : null;
        
        // Generate unique display ID
        const displayId = await generateDisplayId('LEAVE');
        
        return await LeaveRequest.create({ ...data, branch, displayId });
    }

    async updateStatus(id, { status, supervisorComment, supervisorName }) {
        const leave = await this.getById(id);
        const updateData = { status };
        if (supervisorComment) updateData.supervisorComment = supervisorComment;
        if (supervisorName) updateData.supervisorName = supervisorName;
        await leave.update(updateData);
        return await this.getById(id);
    }

    async delete(id) {
        const leave = await this.getById(id);
        await leave.destroy();
        return { success: true };
    }
}

module.exports = new LeaveRequestService();
