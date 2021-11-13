const errorSerialize = (error) => {
  let errors = { description: error.name, name: error.message };

  if (error.hasOwnProperty('details')) {
    errors = error.details.map((e) => {
      const erro = {
        description: e.path[0],
        name: e.message
      };

      return erro;
    });
  }
  return errors;
};

module.exports = errorSerialize;
