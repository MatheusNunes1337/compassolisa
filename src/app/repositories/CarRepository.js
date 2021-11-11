const CarModel = require('../models/CarModel');

class CarRepository {
  async getAll(offset = 0, limit = 100, filter) {
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

  async updateAccessory(id, accessoryId, descricao) {
    await CarModel.updateOne(
      {_id: id, "acessorios.id": accessoryId},
      {
        $set: {"acessorios.$.descricao": descricao}
      }
    )
    const car = await this.getById(id)
    return car.acessorios
  }
  

  async delete(id) {
    return await CarModel.findByIdAndDelete(id);
  }
}

module.exports = new CarRepository();
