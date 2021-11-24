const getCnpjPattern = () => {
  const pattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return pattern;
};

const getCepPattern = () => {
  const pattern = /^\d{5}-\d{3}$/;
  return pattern;
};

const getCpfPattern = () => {
  const pattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return pattern;
};

const getObjectIdPattern = () => {
  const pattern = /[0-9a-fA-F]{24}/;
  return pattern;
};

const getLicensePlatePattern = () => {
  const pattern = /[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/;
  return pattern;
};

module.exports = {
  getCnpjPattern,
  getCepPattern,
  getCpfPattern,
  getObjectIdPattern,
  getLicensePlatePattern
};
