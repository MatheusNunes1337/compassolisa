const serialize = ({
  cep, number, complemento, logradouro, bairro, localidade, uf,
}) => ({
  cep, logradouro, complemento, bairro, number, localidade, uf,
});

module.exports = serialize;
