const CarRepository = require('../repositories/CarRepository');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');

class CarService {
  async findAll({ offset, limit, ...filter }) {
    if (filter.descricao) {
      filter['acessorios.descricao'] = filter.descricao;
      delete filter.descricao;
    }

    return CarRepository.getAll(filter, offset, limit);
  }

  async findById(id) {
    return CarRepository.getById(id);
  }

  async create(car) {
    return CarRepository.create(car);
  }

  async update(id, carData) {
    const car = await this.findById(id);
    if (!car) throw new NotFound('Car');

    return CarRepository.update(id, carData);
  }

  async updateAccessory({ id, accessoryId }, { descricao }) {
    const car = await this.findById(id);
    if (!car) throw new NotFound('Car');

    const accessoriesDescription = car.acessorios.filter((acessorio) => acessorio.descricao === descricao);
    if (accessoriesDescription.length > 0) throw new Conflict(`This car already has an accessory called ${descricao}`);

    const response = await CarRepository.updateAccessory(id, accessoryId, descricao);

    if (!response) throw new NotFound('Accessory');

    return response;
  }

  async delete(id) {
    const car = await this.findById(id);
    if (!car) throw new NotFound('Car');

    return CarRepository.delete(id);
  }
}

module.exports = new CarService();
