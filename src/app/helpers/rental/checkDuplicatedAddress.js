const Conflict = require('../../errors/Conflict');

const checkDuplicatedAddress = (adresses) => {
  const adressesArray = [];

  adresses.forEach((address) => {
    const { cep, number } = address;
    if (adressesArray.includes(cep + number)) {
      throw new Conflict(`It seems you trying to register duplicated adresses with cep ${cep} and number ${number}`);
    }
    adressesArray.push(cep + number);
  });
};

module.exports = checkDuplicatedAddress;
