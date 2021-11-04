class InvalidCredentials extends Error {
  constructor(message) {
    super(message);
    this.name = 'Invalid credentials';
    this.ErrorId = 4;
  }
}

module.exports = InvalidCredentials;
