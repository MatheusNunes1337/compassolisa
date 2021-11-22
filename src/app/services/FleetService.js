const FleetRepository = require('../repositories/FleetRepository');
const RentalRepository = require('../repositories/RentalRepository');
const NotFound = require('../errors/NotFound');

class FleetService {
  async getAll({ offset, limit, ...filter }, { id }) {
    const rental = await RentalRepository.getById(id);
    if (!rental) throw new NotFound('Rental');

    filter.id_locadora = id;
    return FleetRepository.getAll(filter, offset, limit);
  }
}

module.exports = new FleetService();
