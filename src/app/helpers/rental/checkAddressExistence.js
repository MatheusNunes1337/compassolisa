const RentalRepository = require('../../repositories/RentalRepository');
const { paginateSerialize } = require('../../serialize/rentalSerialize');
const Conflict = require('../../errors/Conflict');

const checkAddressExistence = async (cep, number) => {
  const filter = {};
  filter['endereco.cep'] = cep;
  filter['endereco.number'] = number;

  const rental = await RentalRepository.getAll(0, 100, filter);

  if (paginateSerialize(rental).locadoras.length > 0)
    throw new Conflict(`The address with cep ${cep} and number ${number} already in use`);
};

module.exports = checkAddressExistence;
