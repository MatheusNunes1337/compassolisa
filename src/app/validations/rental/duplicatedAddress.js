const Conflict = require('../../errors/Conflict');

const duplicatedAddress = (adresses) => {
  const adressesArray = [];

  adresses.map((address) => {
    const { cep, number } = address;
    if (adressesArray.includes(cep + number)) { throw new Conflict(`It seems you trying to register duplicated adresses with cep ${cep} and number ${number}`); }
    adressesArray.push(cep + number);
  });
};

module.exports = duplicatedAddress;
