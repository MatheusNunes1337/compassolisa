const FleetRepository = require('../repositories/FleetRepository');
const RentalRepository = require('../repositories/RentalRepository');
const CarRepository = require('../repositories/CarRepository');

const NotFound = require('../errors/NotFound');
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

    return FleetRepository.getById(id, rentalId);
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

  async update(payload, { rentalId, id }) {
    await this.getById({ id, rentalId });

    const { id_carro, placa } = payload;

    if (id_carro) {
      const car = await CarRepository.getById(id_carro);
      if (!car) throw new NotFound('Car');
    }

    const fleet = await FleetRepository.getById(id, rentalId);
    if (!fleet) throw new NotFound('Fleet');

    if (placa) await licensePlateVerification(placa);

    return FleetRepository.update(id, payload);
  }

  async delete({ id, rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');

    const fleet = await FleetRepository.getById(id, rentalId);
    if (!fleet) throw new NotFound('Fleet');

    return FleetRepository.delete(id);
  }
}

module.exports = new FleetService();
