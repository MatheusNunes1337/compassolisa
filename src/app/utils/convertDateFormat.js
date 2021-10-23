const moment = require('moment')

const convertDateFormat = (dob) => {
    const reference_date = moment().subtract(18, 'years')
    const dob_formated = moment(dob, 'DD/MM/YYYY').format("MM-DD-YYYY")

    return { reference_date, dob_formated }
} 

module.exports = convertDateFormat