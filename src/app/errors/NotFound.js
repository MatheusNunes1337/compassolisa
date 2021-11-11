class NotFound extends Error {
  constructor(name) {
    super(`${name} not found`);
    this.name = 'Not Found';
  }
}

module.exports = NotFound;
