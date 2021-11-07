const RentalModel = require('../models/RentalModel');

class RentalRepository {
    async getAll(offset = 0, limit = 100, filter) {
        return await RentalModel.paginate(filter, { offset, limit })
    }
}

module.exports = new RentalRepository();
