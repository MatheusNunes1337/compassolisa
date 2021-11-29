const errorSerialize = (error) => {
  let errors = { description: error.name, name: error.message };

  if (error.details) {
    errors = error.details.map((err) => {
      const erro = {
        description: err.path[0],
        name: err.message
      };

      return erro;
    });
  }
  return errors;
};

module.exports = errorSerialize;
