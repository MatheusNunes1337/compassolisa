class Authentication extends Error {
  constructor(message) {
    super(message);
    this.name = 'Authentication';
  }
}

module.exports = Authentication;
