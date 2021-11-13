const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
let databaseUrl;

if (process.env.NODE_ENV === 'test') {
  databaseUrl = process.env.MONGO_URL_TEST;
} else {
  databaseUrl = process.env.MONGO_URL;
}

class DatabaseConnection {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.connect(databaseUrl);
  }
}

module.exports = new DatabaseConnection();
