const ReserveRepository = require('../repositories/ReserveRepository');
const RentalRepository = require('../repositories/RentalRepository');
const fleetRepository = require('../repositories/FleetRepository');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const calcReservePrice = require('../utils/calcReservePrice');
const checkUserReserves = require('../helpers/reserve/checkUserReserves');
const checkReserveConflict = require('../helpers/reserve/checkReserveConflict');

class ReserveService {
  async getAll({ offset, limit, ...filter }, { rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');

    filter.id_locadora = rentalId;
    return ReserveRepository.getAll(filter, offset, limit);
  }

  async getById({ id, rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');

    return ReserveRepository.getById(id);
  }

  async create(userId, userStatus, { rentalId }, payload) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');

    payload.id_locadora = rentalId;

    const { id_carro } = payload;

    const fleet = await fleetRepository.getById(id_carro);
    if (!fleet) throw new NotFound('Fleet');

    if (userStatus !== 'sim') throw new BadRequest('You must have a license to rent a car');

    payload.id_user = userId;

    const { data_inicio, data_fim } = payload;
    const { valor_diaria } = fleet;

    await checkReserveConflict(id_carro, data_inicio, data_fim);
    await checkUserReserves(userId, data_inicio, data_fim);

    payload.valor_final = calcReservePrice(data_inicio, data_fim, valor_diaria);

    return ReserveRepository.create(payload);
  }

  async update(userId, { rentalId, id }, payload) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');

    const reserve = await ReserveRepository.getById(id, rentalId);
    if (!reserve) throw new NotFound('Reserve');

    const { data_inicio, data_fim } = reserve;

    const fleet = await fleetRepository.getById(reserve.id_carro, rentalId);

    const { valor_diaria, _id } = fleet;

    if (payload.data_inicio || payload.data_fim) {
      let initialDate = data_inicio;
      let finalDate = data_fim;

      if (payload.data_inicio) initialDate = payload.data_inicio;
      if (payload.data_fim) finalDate = payload.data_fim;

      await checkReserveConflict(_id.toString(), initialDate, finalDate);
      await checkUserReserves(userId, initialDate, finalDate);

      payload.valor_final = calcReservePrice(initialDate, finalDate, valor_diaria);
    }
  }

  async delete({ id, rentalId }) {
    const rental = await RentalRepository.getById(rentalId);
    if (!rental) throw new NotFound('Rental');

    const reserve = await ReserveRepository.getById(id, rentalId);
    if (!reserve) throw new NotFound('Reserve');

    return ReserveRepository.delete(id);
  }
}

module.exports = new ReserveService();
