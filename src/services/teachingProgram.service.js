const { TeachingProgram } = require('../models');

class TeachingProgramService {
    async getAll(branch = null) {
        const where = { isDeleted: false };
        if (branch) where.branch = branch;
        return await TeachingProgram.findAll({ where, order: [['createdAt', 'DESC']] });
    }

    async getById(id) {
        const program = await TeachingProgram.findOne({ where: { id, isDeleted: false } });
        if (!program) throw new Error('Teaching program not found');
        return program;
    }

    async create(data) {
        return await TeachingProgram.create(data);
    }

    async update(id, data) {
        const program = await this.getById(id);
        return await program.update(data);
    }

    async delete(id) {
        const program = await this.getById(id);
        return await program.update({ isDeleted: true, deletedAt: new Date() });
    }
}

module.exports = new TeachingProgramService();
