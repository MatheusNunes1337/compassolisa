const FleetRepository = require('../../repositories/FleetRepository');
const Conflict = require('../../errors/Conflict');

const checkDuplicatedCar = async (id_carro, id_locadora) => {
  const fleet = await FleetRepository.getAll({ id_carro, id_locadora });
  if (fleet.docs.length > 0) throw new Conflict(`The car with id: ${id_carro} is already registered in this rental`);
};

module.exports = checkDuplicatedCar;
