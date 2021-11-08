const RentalRepository = require('../repositories/RentalRepository');
const AddressProvider = require('../providers/AddressProvider')
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const serialize = require('../serialize/addressSerialize');
const cnpjVerification = require('../validations/rental/cnpjVerification');
const filialVerification = require('../validations/rental/filialVerification')

class RentalService {
  async getAll({ offset, limit, ...filter }) {
      const addressFields = ['cep', 'logradouro', 'complemento', 'bairro', 
      'number', 'localidade', 'uf', 'isFilial']
    
      offset ? parseInt(offset): undefined;
      limit ? parseInt(limit) : undefined;
      
      if(offset < 0 || limit < 0) 
        throw new BadRequest('Limit and offset cannot be negative')

      Object.keys(filter).forEach(field => {
          if(addressFields.includes(field)) {
            filter[`endereco.${field}`] = filter[field]
            delete filter[field]
          }
      })
  
      return await RentalRepository.getAll(offset, limit, filter);
  }

  async getById(id) {
    return await RentalRepository.getById(id)
  }

  async create(payload) {
    const {endereco, cnpj} = payload

    await cnpjVerification(cnpj)

    filialVerification(endereco)
    
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
