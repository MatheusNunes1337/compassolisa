const CarModel = require('../models/CarModel');

class CarRepository {
  async getAll(offset, limit, filter) {
    return await CarModel.paginate(filter, { offset, limit })
  }
  
  async getById(id) {
    return await CarModel.findById(id);
  }

  async create(car) {
    return await CarModel.create(car);
  }

  async update(id, carData) {
    const response = await CarModel.findByIdAndUpdate(id, carData, { new: true });
    return response;
  }

  async delete(id) {
    return await CarModel.findByIdAndDelete(id);
  }
}

module.exports = new CarRepository();
