const RentalModel = require('../models/RentalModel');

class RentalRepository {
    async getAll(offset = 0, limit = 100, filter) {
        return await RentalModel.paginate(filter, { offset, limit })
    }

    async getById(id) {
        return await RentalModel.findById(id)
    }

    async create(payload) {
        return await RentalModel.create(payload)
    }

    async update(id, payload) {
       return await RentalModel.findByIdAndUpdate(id, payload, { new: true });
    }

    async delete(id) {
        return await RentalModel.findByIdAndDelete(id)
    }
}

module.exports = new RentalRepository();
