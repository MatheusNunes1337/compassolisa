const BadRequest = require('../../errors/BadRequest');

const filialVerification = (adresses) => {
  const matriz = adresses.filter((address) => address.isFilial === false);

  if (matriz.length === 0) { throw new BadRequest('A rental must have a head office'); }

  if (matriz.length > 1) { throw new BadRequest('A rental must have only one head office'); }
};

module.exports = filialVerification;
