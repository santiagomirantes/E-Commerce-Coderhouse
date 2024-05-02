class CustomError {
    constructor(name = "ERROR", message, code = 0) {
        const error = new Error(message)
        error.name = name
        error.code = code
        return error
    }
}

module.exports = {CustomError}