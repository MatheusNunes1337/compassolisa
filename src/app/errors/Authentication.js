class Authentication extends Error {
  constructor(message) {
    super(message);
    this.name = 'Authentication';
    this.ErrorId = 3;
  }
}

module.exports = Authentication;
