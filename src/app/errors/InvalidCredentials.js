class InvalidCredentials extends Error {
  constructor(message) {
    super(message);
    this.name = 'Invalid credentials';
  }
}

module.exports = InvalidCredentials;
