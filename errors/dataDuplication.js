class DuplicationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 409;
        this.name = 'DuplicateData';
    }
}

module.exports = DuplicationError;