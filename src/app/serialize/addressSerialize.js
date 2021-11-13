const serialize = ({ cep, number, complemento, isFilial, logradouro, bairro, localidade, uf }) => ({
  cep,
  logradouro,
  complemento,
  bairro,
  number,
  localidade,
  uf,
  isFilial
});

module.exports = serialize;
