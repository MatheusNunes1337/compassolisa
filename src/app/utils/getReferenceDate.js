const moment = require('moment');

const getReferenceDate = () => {
  const referenceDate = moment().subtract(18, 'years').format('MM-DD-YYYY');
  return referenceDate;
};

module.exports = getReferenceDate;
