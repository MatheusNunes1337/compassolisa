const RentalModel = require('../models/RentalModel');

class RentalRepository {
  async getAll(filter, offset = 0, limit = 100) {
    return RentalModel.paginate(filter, { offset, limit });
  }

  async getById(id) {
    return RentalModel.findById(id);
  }

  async create(payload) {
    return RentalModel.create(payload);
  }

  async update(id, payload) {
    return RentalModel.findByIdAndUpdate(id, payload, { new: true });
  }

  async delete(id) {
    return RentalModel.findByIdAndDelete(id);
  }
}

module.exports = new RentalRepository();
