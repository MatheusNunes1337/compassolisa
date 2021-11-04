const errorSerialize = (error) => {
  const { name, message } = error;
  return { description: name, name: message };
};

module.exports = errorSerialize;
