const RentalRepository = require('../../repositories/RentalRepository');
const Conflict = require('../../errors/Conflict');

const checkCnpjUsage = async (cnpj) => {
  const rental = await RentalRepository.getAll({ cnpj }, 0, 100);
  if (rental.docs.length > 0) throw new Conflict(`Cnpj ${cnpj} already in use`);
};

module.exports = checkCnpjUsage;
