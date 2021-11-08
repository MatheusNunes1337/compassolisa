const serialize = ({
  cep, number, complemento, isFilial, logradouro, bairro, localidade, uf,
}, omitIsFilial = true) => {
  if (omitIsFilial) {
    return {
      cep, logradouro, complemento, bairro, number, localidade, uf,
    };
  }
  return {
    cep, logradouro, complemento, bairro, number, localidade, uf, isFilial,
  };
};

module.exports = serialize;
