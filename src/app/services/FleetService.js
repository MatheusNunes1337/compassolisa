const FleetRepository = require('../repositories/FleetRepository');
const RentalRepository = require('../repositories/RentalRepository');
const NotFound = require('../errors/NotFound');

class FleetService {
  async getAll({ offset, limit, ...filter }, { rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');

    filter.id_locadora = rentalId;
    return FleetRepository.getAll(filter, offset, limit);
  }

  async getById({ id, rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');

    return FleetRepository.getById(id, rentalId);
  }
}

module.exports = new FleetService();
