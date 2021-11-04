const errorSerialize = (error) => {
  let description = error.name;
  let name = error.message;

  if (error.hasOwnProperty('details')) {
    const { message, path } = error.details[0];
    description = path[0];
    name = message;
  }
  return { description, name };
};

module.exports = errorSerialize;
