const CarSchema = require('../schemas/CarSchema');

class CarRepository {
  async getAll(filter, offset = 0, limit = 100) {
    Number(limit);
    Number(offset);

    return CarSchema.paginate(filter, { offset, limit });
  }

  async getById(id) {
    return CarSchema.findById(id);
  }

  async create(car) {
    return CarSchema.create(car);
  }

  async update(id, carData) {
    return CarSchema.findByIdAndUpdate(id, carData, { new: true });
  }

  async updateAccessory(carId, accessoryId, descricao) {
    const car = await CarSchema.findOneAndUpdate(
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
    return CarSchema.findByIdAndDelete(id);
  }
}

module.exports = new CarRepository();
