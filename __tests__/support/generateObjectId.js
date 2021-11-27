const mongoose = require('mongoose');

const generateObjectId = () => new mongoose.Types.ObjectId();

module.exports = generateObjectId;
