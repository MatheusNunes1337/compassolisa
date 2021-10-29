const mongoose = require('mongoose');

const checkIdFormat = (req, res, next) => {
  try {
    const { id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error('The submitted id has an invalid format');
    return next();
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

module.exports = checkIdFormat;
