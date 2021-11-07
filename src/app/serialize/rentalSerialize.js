const serialize = ({
  _id, nome, cnpj, atividades, endereco,
}) => ({
  _id, nome, cnpj, atividades, endereco,
});

const paginateSerialize = ({
  docs, limit, totalDocs, pagingCounter, totalPages,
}) => ({
  locadoras: docs.map(serialize),
  limit,
  total: totalDocs,
  offset: pagingCounter,
  offsets: totalPages,
});

module.exports = { serialize, paginateSerialize };
