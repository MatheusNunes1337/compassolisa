class InvalidParam extends Error {
  constructor(message) {
    super(message);
    this.name = 'Invalid parameter';
  }
}

module.exports = InvalidParam;
