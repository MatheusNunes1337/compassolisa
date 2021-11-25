const ReserveRepository = require('../repositories/ReserveRepository');
const RentalRepository = require('../repositories/RentalRepository');
const CarRepository = require('../repositories/CarRepository');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');

class ReserveService {
  async getAll({ offset, limit, ...filter }, { rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');

    filter.id_locadora = rentalId;
    return ReserveRepository.getAll(filter, offset, limit);
  }
}

module.exports = new ReserveService();
