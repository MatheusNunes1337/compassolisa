const moment = require('moment');

const getReferenceDate = () => moment().subtract(18, 'years').format('MM-DD-YYYY');

module.exports = getReferenceDate;
