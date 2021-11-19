const serialize = ({ _id, id_carro, status, valor_diaria, id_locadora, placa }) => ({
  _id,
  id_carro,
  status,
  valor_diaria,
  id_locadora,
  placa
});

const paginateSerialize = ({ docs, limit, totalDocs, pagingCounter, totalPages }) => ({
  frota: docs.map(serialize),
  limit,
  total: totalDocs,
  offset: pagingCounter,
  offsets: totalPages
});

module.exports = { serialize, paginateSerialize };
