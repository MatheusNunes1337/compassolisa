const FleetRepository = require('../repositories/FleetRepository');
const RentalRepository = require('../repositories/RentalRepository');
const CarRepository = require('../repositories/CarRepository');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const licensePlateVerification = require('../helpers/fleet/licensePlateVerification');
const checkDuplicatedCar = require('../helpers/fleet/checkDuplicatedCar');

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

    return FleetRepository.getById(id);
  }

  async create(payload, { rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');
    payload.id_locadora = rentalId;

    const { id_carro, placa } = payload;
    const car = await CarRepository.getById(id_carro);
    if (!car) throw new NotFound('Car');

    await checkDuplicatedCar(id_carro, rentalId);
    await licensePlateVerification(placa);

    return FleetRepository.create(payload);
  }

  async update(payload, { rentalId, id }) {
    await this.getById({ id, rentalId });

    const { id_carro, id_locadora, placa } = payload;

    if (id_carro) {
      const car = await CarRepository.getById(id_carro);
      if (!car) throw new NotFound('Car');
    }

    if (id_locadora) {
      const rental = await RentalRepository.getById(id_locadora);
      if (!rental) throw new NotFound('Rental');
    }

    await checkDuplicatedCar(id_carro, rentalId);
    await licensePlateVerification(placa);

    return FleetRepository.update(id, payload);
  }

  async delete({ id, rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');

    const fleet = await FleetRepository.getById(id);
    if (!fleet) throw new NotFound('Fleet');

    return FleetRepository.delete(id);
  }
}

module.exports = new FleetService();
