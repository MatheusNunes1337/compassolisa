const serialize = ({ _id, id_user, data_inicio, data_fim, id_carro, id_locadora, valor_final }) => ({
  _id,
  id_user,
  data_inicio,
  data_fim,
  id_carro,
  id_locadora,
  valor_final
});

const paginateSerialize = ({ docs, limit, totalDocs, pagingCounter, totalPages }) => ({
  reservas: docs.map(serialize),
  limit,
  total: totalDocs,
  offset: pagingCounter,
  offsets: totalPages
});

module.exports = { serialize, paginateSerialize };
