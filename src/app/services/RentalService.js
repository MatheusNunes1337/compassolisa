const RentalRepository = require('../repositories/RentalRepository');
const AddressProvider = require('../providers/AddressProvider')
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const serialize = require('../serialize/addressSerialize')

class RentalService {
  async getAll({ offset, limit, ...filter }) {
  
      offset ? parseInt(offset): undefined;
      limit ? parseInt(limit) : undefined;
      
      if(offset < 0 || limit < 0) 
        throw new BadRequest('Limit and offset cannot be negative')
      
      return await RentalRepository.getAll(offset, limit, filter);
  }

  async getById(id) {
    return await RentalRepository.getById(id)
  }

  async create(payload) {
    const {endereco} = payload

    const matriz = endereco.filter(e => {
      return e.isFilial === false
    })

    if(matriz.length === 0) 
      throw new BadRequest('A rental must have a head office')
    
    if(matriz.length > 1) 
      throw new BadRequest('A rental must have only one head office')
    
    payload.endereco = await Promise.all(endereco.map(async e => {
      const response = await AddressProvider.getAddress(e.cep)

      if(response.hasOwnProperty('erro'))
        throw new BadRequest(`The cep ${e.cep} does not exist`)

      const fullAddress = Object.assign({}, e, response)

      return serialize(fullAddress, false)
    }))
    return await RentalRepository.create(payload)
  }

  async delete(id) {
    const rental = await this.getById(id)
    if (!rental) {
      throw new NotFound('Rental');
    }
    return await RentalRepository.delete(id)
  }
}

module.exports = new RentalService();
