const FleetRepository = require('../repositories/FleetRepository');
const RentalRepository = require('../repositories/RentalRepository');
const CarRepository = require('../repositories/CarRepository');
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

  async create(payload, { rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');
    payload.id_locadora = rentalId;

    const { id_carro } = payload;
    const car = await CarRepository.getById(id_carro);
    if (!car) throw new NotFound('Car');

    return FleetRepository.create(payload);
  }
}

module.exports = new FleetService();
