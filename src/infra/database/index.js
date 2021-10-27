const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

class DatabaseConnection {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.connect(process.env.MONGO_URL);
  }
}

module.exports = new DatabaseConnection();
