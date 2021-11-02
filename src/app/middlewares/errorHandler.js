const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;

  if (err instanceof Error) statusCode = 400;

  if (err instanceof NotFound) statusCode = 404;

  if (err instanceof Unauthorized) statusCode = 401;

  res.status(statusCode).json({ error: err.message });
};

module.exports = errorHandler;
