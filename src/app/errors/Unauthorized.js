class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauthorized';
    this.ErrorId = 1;
  }
}

module.exports = Unauthorized;
