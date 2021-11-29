const dataFaker = require('./dataFaker');

const generateAccessoryJson = (count = 2) => {
  const objs = [];
  for (let index = 0; index < count; index++) {
    objs.push({
      descricao: dataFaker.string()
    });
  }
  return count === 1 ? objs[0] : objs;
};

const generateCarJson = (count = 1) => {
  const objs = [];
  for (let index = 0; index < count; index++) {
    objs.push({
      modelo: dataFaker.string(),
      cor: dataFaker.color(),
      ano: dataFaker.integer({ min: 1950, max: 2022 }),
      acessorios: dataFaker.array([generateAccessoryJson()]),
      quantidadePassageiros: dataFaker.integer({ min: 2, max: 6 })
    });
  }
  return count === 1 ? objs[0] : objs;
};

module.exports = generateCarJson;
