const errorHandler = (err, req, res, next) => {
 const statusCode = err.statusCode || 500;
 res.status(statusCode).json({
 error: err.name || 'InternalServerError',
 message: err.message || 'An unexpected error occurred'
 });
};

module.exports = errorHandler;