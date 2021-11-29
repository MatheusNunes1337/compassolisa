const mongoose = require('mongoose');
require('dotenv').config();

let mongoUri;

if (process.env.NODE_ENV === 'test') mongoUri = process.env.MONGO_URL_TEST;
else mongoUri = process.env.MONGO_URL;

class DatabaseConnection {
  async connect() {
    return mongoose.connect(mongoUri);
  }
}

module.exports = new DatabaseConnection().connect();
