const NotFound = require('../errors/NotFound');
const errorSerialize = require('../serialize/errorSerialize');

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;

  if (err instanceof NotFound) statusCode = 404;

  else statusCode = 400;

  res.status(statusCode).json(errorSerialize(err));
};

module.exports = errorHandler;
