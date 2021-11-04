class InvalidParam extends Error {
  constructor(message) {
    super(message);
    this.name = 'Invalid parameter';
    this.ErrorId = 5;
  }
}

module.exports = InvalidParam;
