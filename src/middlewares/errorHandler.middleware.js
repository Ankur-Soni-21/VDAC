const errorHandler = (err, req, res, next) => {
    // console.error(err.stack);

    // Determine if the error is client-side or server-side
    const isClientError = err.statusCode && err.statusCode < 500;

    if (isClientError) {
        res.status(err.statusCode).json({
            error: err.message || 'An error occurred while processing your request'
        });
    } else {
        res.status(500).json({
            error: err.message || 'An unexpected error occurred. Our team has been notified.'
        });
    }
};

module.exports = errorHandler;