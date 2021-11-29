const getCnpjPattern = () => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

const getCepPattern = () => /^\d{5}-\d{3}$/;

const getCpfPattern = () => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const getObjectIdPattern = () => /[0-9a-fA-F]{24}/;

const getLicensePlatePattern = () => /[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/;

module.exports = {
  getCnpjPattern,
  getCepPattern,
  getCpfPattern,
  getObjectIdPattern,
  getLicensePlatePattern
};
