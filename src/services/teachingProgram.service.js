const { TeachingProgram } = require('../models');

class TeachingProgramService {
    async getAll() {
        return await TeachingProgram.findAll({ where: { isDeleted: false } });
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
