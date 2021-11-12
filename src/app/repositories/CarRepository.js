const CarModel = require('../models/CarModel');

class CarRepository {
  async getAll(filter, offset = 0, limit = 100) {
    return CarModel.paginate(filter, { offset, limit });
  }

  async getById(id) {
    return CarModel.findById(id);
  }

  async create(car) {
    return CarModel.create(car);
  }

  async update(id, carData) {
    const response = await CarModel.findByIdAndUpdate(id, carData, { new: true });
    return response;
  }

  async updateAccessory(carId, accessoryId, descricao) {
    const car = await CarModel.findOneAndUpdate(
      { _id: carId, 'acessorios._id': accessoryId },
      {
        $set: {
          'acessorios.$.descricao': descricao
        }
      },
      { new: true }
    );
    return car;
  }

  async delete(id) {
    return CarModel.findByIdAndDelete(id);
  }
}

module.exports = new CarRepository();
