const FleetRepository = require('../repositories/FleetRepository');
const RentalRepository = require('../repositories/RentalRepository');
const CarRepository = require('../repositories/CarRepository');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const licensePlateVerification = require('../helpers/fleet/licensePlateVerification');

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

    const fleet = await FleetRepository.getById(id);

    if (!fleet) throw new NotFound('Fleet');

    if (fleet.id_locadora.toString() !== rentalId)
      throw new BadRequest('Essa frota não pertence à locadora informada.');

    return fleet;
  }

  async create(payload, { rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');
    payload.id_locadora = rentalId;

    const { id_carro, placa } = payload;
    const car = await CarRepository.getById(id_carro);
    if (!car) throw new NotFound('Car');

    await licensePlateVerification(placa);

    return FleetRepository.create(payload);
  }

  async delete({ id, rentalId }) {
    const { _id } = await this.getById({ id, rentalId });
    return FleetRepository.delete(_id);
  }
}

module.exports = new FleetService();
