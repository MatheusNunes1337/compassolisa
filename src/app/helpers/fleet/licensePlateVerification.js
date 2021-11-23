const FleetRepository = require('../../repositories/FleetRepository');
const Conflict = require('../../errors/Conflict');

const licensePlateVerification = async (licensePlate) => {
  const fleet = await FleetRepository.getAll({ placa: licensePlate });
  if (fleet.docs.length > 0) throw new Conflict(`The license plate ${licensePlate} already in use`);
};

module.exports = licensePlateVerification;
