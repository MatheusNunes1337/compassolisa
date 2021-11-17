const addressSerialize = require('./addressSerialize');

function serialize({ _id, nome, cnpj, atividades, endereco }) {
  endereco = endereco.map((address) => addressSerialize(address, true));
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
