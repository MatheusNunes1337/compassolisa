const CarRepository = require('../repositories/CarRepository');
const NotFound = require('../errors/NotFound');

class CarService {
  async findAll({ offset, limit }) {
    return await CarRepository.getAll(offset, limit);
  }

  async findByFilter({ offset, limit, ...filter }) {
    if (filter.descricao) {
      filter.acessorios = { descricao: filter.descricao };
    }

    return await CarRepository.getByFilter(offset, limit, filter);
  }

  async findById(id) {
    const car = await CarRepository.getById(id);
    return car;
  }

  async create(car) {
    return await CarRepository.create(car);
  }

  async update(id, carData) {
    const car = await this.findById(id);
    if (!car) {
      throw new NotFound('Car');
    }
    return await CarRepository.update(id, carData);
  }

  async delete(id) {
    const car = await this.findById(id);
    if (!car) {
      throw new NotFound('Car');
    }
    return await CarRepository.delete(id);
  }
}

module.exports = new CarService();
