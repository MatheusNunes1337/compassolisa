const moment = require('moment');
const ReserveRepository = require('../../repositories/ReserveRepository');
const Conflict = require('../../errors/Conflict');

const checkReserveConflict = async (id_carro, initialDate, finalDate) => {
  const reserves = await ReserveRepository.getAll({ id_carro });
  if (!reserves) return true;

  reserves.docs.forEach((reserve) => {
    const { data_inicio, data_fim } = reserve;
    if (
      !moment(initialDate, 'DD/MM/YYYY').isAfter(moment(data_fim, 'DD/MM/YYYY')) &&
      !moment(finalDate, 'DD/MM/YYYY').isBefore(moment(data_inicio, 'DD/MM/YYYY'))
    ) {
      throw new Conflict(`This car is rented from ${data_inicio} until ${data_fim}`);
    }
  });

  return true;
};

module.exports = checkReserveConflict;
