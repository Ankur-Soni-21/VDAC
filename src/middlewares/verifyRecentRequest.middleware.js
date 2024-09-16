const createError = require('http-errors');
const validateRecentRequest = async (req, res, next) => {
    const { ts } = req.body;
    const now = Math.floor(Date.now() / 1000);
    if (now - ts > 300 || ts > now) {
        next(createError('Request Expired'));
    } else {
        console.log('Request is valid');
    }
    next();
}

module.exports = validateRecentRequest;