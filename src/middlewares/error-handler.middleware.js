const errorHandler = (err, req, res, next) => {
    // Send error response
    res.status(err.statusCode || 500).json(err || 'Internal Server Error');
};

module.exports = errorHandler;