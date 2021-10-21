class NotFound extends Error {
    constructor(name) {
        super(`${name} not found`)
        this.name = 'Not Found'
        this.ErrorId = 0
    }
}

module.exports = NotFound