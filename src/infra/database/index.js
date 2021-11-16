const mongoose = require('mongoose');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

class DatabaseConnection {
  connect() {
    mongoose.connect(process.env.MONGO_URL);
  }
}

module.exports = new DatabaseConnection().connect();
