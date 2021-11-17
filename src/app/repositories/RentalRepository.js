const RentalSchema = require('../schemas/RentalSchema');

class RentalRepository {
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

  async getById(id) {
    return RentalSchema.findById(id);
  }

  async create(payload) {
    return RentalSchema.create(payload);
  }

  async update(id, payload) {
    return RentalSchema.findByIdAndUpdate(id, payload, { new: true });
  }

  async delete(id) {
    return RentalSchema.findByIdAndDelete(id);
  }
}

module.exports = new RentalRepository();
