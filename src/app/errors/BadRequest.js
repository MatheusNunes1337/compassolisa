class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = 'Bad Request';
    this.ErrorId = 1;
  }
}

module.exports = BadRequest;
