const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    } else if (err.code === 11000) {
        statusCode = 409;
        message = "Duplicate value already exists";
    }

    res.status(statusCode).json({
        message
    });
};

module.exports = errorHandler;