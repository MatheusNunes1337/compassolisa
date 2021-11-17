const serialize = (
  { cep, number, complemento, isFilial, logradouro, bairro, localidade, uf },
  hideIsFilial = false
) => {
  let objectSerialized;

  if (hideIsFilial === false) {
    objectSerialized = { cep, logradouro, complemento, bairro, number, localidade, uf, isFilial };
  } else {
    objectSerialized = { cep, logradouro, complemento, bairro, number, localidade, uf };
  }

  return objectSerialized;
};

module.exports = serialize;
