const CarSchema = require('../schemas/CarSchema');
const Repository = require('./Repository');

class CarRepository extends Repository {
  constructor() {
    super(CarSchema);
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
}

module.exports = new CarRepository();
