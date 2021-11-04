class Conflict extends Error {
  constructor(message) {
    super(message);
    this.name = 'Conflict';
    this.ErrorId = 2;
  }
}

module.exports = Conflict;
