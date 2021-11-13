function serialize({ _id, nome, cnpj, atividades, endereco }) {
  endereco.map((address) => (address.isFilial = undefined));
  return {
    _id,
    nome,
    cnpj,
    atividades,
    endereco
  };
}

const paginateSerialize = ({ docs, limit, totalDocs, pagingCounter, totalPages }) => ({
  locadoras: docs.map(serialize),
  limit,
  total: totalDocs,
  offset: pagingCounter,
  offsets: totalPages
});

module.exports = { serialize, paginateSerialize };
