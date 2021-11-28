const dataFaker = require('./dataFaker');

const generateAddressJson = (count = 2) => {
  const objs = [];
  for (let index = 0; index < count; index++) {
    objs.push({
      number: dataFaker.integer({ min: 0, max: 10000 }),
      complemento: dataFaker.string(),
      isFilial: dataFaker.bool({ likelihood: 0 })
    });
  }
  return count === 1 ? objs[0] : objs;
};

const generateRentalJson = (count = 1) => {
  const objs = [];
  for (let index = 0; index < count; index++) {
    objs.push({
      nome: dataFaker.string(),
      cnpj: dataFaker.cnpj(),
      atividades: dataFaker.string(),
      endereco: dataFaker.array([generateAddressJson()])
    });
  }
  return count === 1 ? objs[0] : objs;
};

module.exports = generateRentalJson;
