const RentalRepository = require('../repositories/RentalRepository');
const AddressProvider = require('../providers/AddressProvider')
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const serialize = require('../serialize/addressSerialize');
const checkCnpjUsage = require('../helpers/rental/checkCnpjUsage')
const headOfficeVerification = require('../helpers/rental/headOfficeVerification')
const checkAddressExistence = require('../helpers/rental/checkAddressExistence')
const checkDuplicatedAddress = require('../helpers/rental/checkDuplicatedAddress')

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

    await checkCnpjUsage(cnpj)

    headOfficeVerification(endereco)
    checkDuplicatedAddress(endereco)
    
    payload.endereco = await Promise.all(endereco.map(async address => {
      await checkAddressExistence(address.cep, address.number)

      const response = await AddressProvider.getAddress(address.cep)

      if(response.hasOwnProperty('erro'))
        throw new BadRequest(`The cep ${address.cep} does not exist`)

      const fullAddress = Object.assign({}, address, response)

      return serialize(fullAddress)
    }))

    return await RentalRepository.create(payload)
  }

  async update({id}, payload) {
    const rental = await this.getById(id)

    if (!rental) 
      throw new NotFound('Rental');
  
    if(payload.cnpj)
      await checkCnpjUsage(payload.cnpj)

    if(payload.endereco) {
      const {endereco} = payload

      headOfficeVerification(endereco)
      checkDuplicatedAddress(endereco)
    
      payload.endereco = await Promise.all(endereco.map(async address => {
        await checkAddressExistence(address.cep, address.number)

        const response = await AddressProvider.getAddress(address.cep)

        if(response.hasOwnProperty('erro'))
          throw new BadRequest(`The cep ${address.cep} does not exist`)

        const fullAddress = Object.assign({}, address, response)

        return serialize(fullAddress)
      }))
    }
    
    return await RentalRepository.update(id, payload)

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
