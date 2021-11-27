const moment = require('moment');
const ReserveRepository = require('../../repositories/ReserveRepository');
const BadRequest = require('../../errors/BadRequest');

const checkUserReserves = async (id_user, initialDate, finalDate) => {
  const reserves = await ReserveRepository.getAll({ id_user });
  if (!reserves) return true;

  reserves.docs.forEach((reserve) => {
    const { data_inicio, data_fim } = reserve;
    if (
      !moment(initialDate, 'DD/MM/YYYY').isAfter(moment(data_fim, 'DD/MM/YYYY')) &&
      !moment(finalDate, 'DD/MM/YYYY').isBefore(moment(data_inicio, 'DD/MM/YYYY'))
    ) {
      throw new BadRequest(`You cannot rent a car between ${data_inicio} and ${data_fim}`);
    }
  });

  return true;
};

module.exports = checkUserReserves;
