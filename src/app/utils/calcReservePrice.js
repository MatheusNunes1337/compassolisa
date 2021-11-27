const moment = require('moment');

const calcReservePrice = (initialDate, finalDate, dailyPrice) => {
  const totalRentalDays = moment(finalDate, 'DD/MM/YYYY').diff(moment(initialDate, 'DD/MM/YYYY'), 'days');
  return dailyPrice * totalRentalDays;
};

module.exports = calcReservePrice;
