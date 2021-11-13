const serialize = ({ _id, nome, cpf, data_nascimento, email, habilitado }) => ({
  _id,
  nome,
  cpf,
  data_nascimento,
  email,
  habilitado
});

const paginateSerialize = ({ docs, limit, totalDocs, pagingCounter, totalPages }) => ({
  pessoas: docs.map(serialize),
  limit,
  total: totalDocs,
  offset: pagingCounter,
  offsets: totalPages
});

module.exports = { serialize, paginateSerialize };
