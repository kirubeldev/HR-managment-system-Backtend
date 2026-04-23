const sequelize = require('../config/database');
const Role = require('./Role');
const Permission = require('./Permission');
const User = require('./User');
const Employee = require('./Employee');
const Department = require('./Department');
const AuditLog = require('./AuditLog');
const RefreshToken = require('./RefreshToken');
const Student = require('./Student');
const TeachingProgram = require('./TeachingProgram');
const LeaveRequest = require('./LeaveRequest');
const Project = require('./Project');
const Position = require('./Position');

// Role <-> Permission (many-to-many)
Role.belongsToMany(Permission, { through: 'role_permissions', foreignKey: 'roleId', otherKey: 'permissionId', as: 'permissions' });
Permission.belongsToMany(Role, { through: 'role_permissions', foreignKey: 'roleId', otherKey: 'permissionId', as: 'roles' });

// User -> Role
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

// Employee -> Department
Employee.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Department.hasMany(Employee, { foreignKey: 'departmentId', as: 'employees' });

// Department -> Employee (manager)
Department.belongsTo(Employee, { foreignKey: 'managerId', as: 'manager' });

// AuditLog -> User
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// RefreshToken <-> User
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Student <-> Employee (Teacher)
Student.belongsTo(Employee, { foreignKey: 'teacherId', as: 'teacher' });
Employee.hasMany(Student, { foreignKey: 'teacherId', as: 'students' });

// Employee <-> LeaveRequest
Employee.hasMany(LeaveRequest, { foreignKey: 'employeeId', as: 'leaveRequests' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Student <-> TeachingProgram (many-to-many)
Student.belongsToMany(TeachingProgram, { through: 'student_programs', foreignKey: 'studentId', otherKey: 'programId', as: 'programs' });
TeachingProgram.belongsToMany(Student, { through: 'student_programs', foreignKey: 'programId', otherKey: 'studentId', as: 'students' });

// Project -> Employee (manager)
Project.belongsTo(Employee, { foreignKey: 'managerId', as: 'manager' });

// Student -> Project (funding)
Student.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Project.hasMany(Student, { foreignKey: 'projectId', as: 'students' });

// Position <-> Permission (many-to-many)
Position.belongsToMany(Permission, { through: 'position_permissions', foreignKey: 'positionId', otherKey: 'permissionId', as: 'permissions' });
Permission.belongsToMany(Position, { through: 'position_permissions', foreignKey: 'permissionId', otherKey: 'positionId', as: 'positions' });

module.exports = {
    sequelize,
    Role,
    Permission,
    User,
    Employee,
    Department,
    AuditLog,
    RefreshToken,
    Student,
    TeachingProgram,
    LeaveRequest,
    Project,
    Position
};
