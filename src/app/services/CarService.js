const CarRepository = require('../repositories/CarRepository');
const NotFound = require('../errors/NotFound');

class CarService {
  async findAll({ offset, limit, ...filter }) {
    if(!offset && !limit) {
       offset = 1
       limit = 100
    } else {
      offset = parseInt(offset);
      limit = parseInt(limit);
      
      if(offset < 0 || limit < 0) 
        throw new Error('Limit and offset cannot have nagative values')
    }

    if (filter.descricao) {
      filter.acessorios = { descricao: filter.descricao };
    }

    const result = await CarRepository.getAll(offset, limit, filter);
    const { docs, totalDocs } = result
    
    const response = {}
    response.veiculos = docs
    response.total = totalDocs
    response.limit = limit
    response.offset = offset
    response.offsets = docs.length

    return response
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
