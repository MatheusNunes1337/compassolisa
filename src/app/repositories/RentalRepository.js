const RentalSchema = require('../schemas/RentalSchema');
const Repository = require('./Repository');

class RentalRepository extends Repository {
  constructor() {
    super(RentalSchema);
  }

  async getAll(filter, offset = 0, limit = 100) {
    Number(limit);
    Number(offset);

    const addressFields = ['cep', 'logradouro', 'complemento', 'bairro', 'number', 'localidade', 'uf', 'isFilial'];

    Object.keys(filter).forEach((field) => {
      if (addressFields.includes(field)) {
        filter[`endereco.${field}`] = filter[field];
        delete filter[field];
      }
    });

    return RentalSchema.paginate(filter, { offset, limit });
  }
}

module.exports = new RentalRepository();
