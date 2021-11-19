const RentalRepository = require('../repositories/RentalRepository');
const Repository = require('../repositories/Repository');
const AddressProvider = require('../providers/AddressProvider');
const RentalSchema = require('../schemas/RentalSchema');

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

const serialize = require('../serialize/addressSerialize');
const checkCnpjUsage = require('../helpers/rental/checkCnpjUsage');
const headOfficeVerification = require('../helpers/rental/headOfficeVerification');
const checkAddressExistence = require('../helpers/rental/checkAddressExistence');
const checkDuplicatedAddress = require('../helpers/rental/checkDuplicatedAddress');

class RentalService {
  constructor() {
    this.repository = new Repository(RentalSchema);
  }

  async getAll({ offset, limit, ...filter }) {
    return RentalRepository.getAll(filter, offset, limit);
  }

  async getById(id) {
    return this.repository.getById(id);
  }

  async create(payload) {
    const { endereco, cnpj } = payload;

    await checkCnpjUsage(cnpj);

    headOfficeVerification(endereco);
    checkDuplicatedAddress(endereco);

    payload.endereco = await Promise.all(
      endereco.map(async (address) => {
        await checkAddressExistence(address.cep, address.number);

        const response = await AddressProvider.getAddress(address.cep);

        if (response.hasOwnProperty('erro')) throw new BadRequest(`The cep ${address.cep} does not exist`);

        const fullAddress = { ...address, ...response };

        return serialize(fullAddress);
      })
    );

    return this.repository.create(payload);
  }

  async update({ id }, payload) {
    const rental = await this.getById(id);

    if (!rental) throw new NotFound('Rental');

    if (payload.cnpj) await checkCnpjUsage(payload.cnpj);

    if (payload.endereco) {
      const { endereco } = payload;

      headOfficeVerification(endereco);
      checkDuplicatedAddress(endereco);

      payload.endereco = await Promise.all(
        endereco.map(async (address) => {
          await checkAddressExistence(address.cep, address.number);

          const response = await AddressProvider.getAddress(address.cep);

          if (response.hasOwnProperty('erro')) throw new BadRequest(`The cep ${address.cep} does not exist`);

          const fullAddress = { ...address, ...response };

          return serialize(fullAddress);
        })
      );
    }

    return this.repository.update(id, payload);
  }

  async delete(id) {
    const rental = await this.getById(id);
    if (!rental) {
      throw new NotFound('Rental');
    }
    return this.repository.delete(id);
  }
}

module.exports = new RentalService();
