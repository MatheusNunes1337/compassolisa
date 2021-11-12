const CarRepository = require('../repositories/CarRepository');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest')
const Conflict = require('../errors/Conflict')

class CarService {
  async findAll({ offset, limit, ...filter }) {
   
    offset ? parseInt(offset): undefined;
    limit ? parseInt(limit) : undefined;
    
    if(offset < 0 || limit < 0) 
      throw new BadRequest('Limit and offset cannot be negative')
      
    if (filter.descricao) {
      filter['acessorios.descricao'] = filter.descricao
      delete filter.descricao
    }

    return await CarRepository.getAll(offset, limit, filter);
  
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

  async updateAccessory({id, accessoryId}, {descricao}) {
    const car = await this.findById(id);
    if (!car) 
      throw new NotFound('Car');

    const accessoriesDescription = car.acessorios.filter(acessorio => acessorio.descricao === descricao)
    if(accessoriesDescription.length > 0) {
      throw new Conflict(`This car already has an accessory called ${descricao}`);
    }

    const response = await CarRepository.updateAccessory(id, accessoryId, descricao)

    if(!response) 
      throw new NotFound('Accessory')

    return response
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
