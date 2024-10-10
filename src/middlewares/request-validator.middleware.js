const createError = require('http-errors');
require('dotenv').config();
const validateRecentRequest = async (req, res, next) => {
    try {
        // 5 minutes beofre request expires by default
        const REQUEST_EXPIRY = process.env.REQUEST_EXPIRY || 300;
        if (!req.body)
            throw createError(404, 'Invalid Request');
        else if (!req.body.ts)
            throw createError(404, 'Invalid Parameters');

        const { ts } = req.body;
        const now = Math.floor(Date.now() / 1000);
        if (now - ts > REQUEST_EXPIRY || ts > now) {
            next(createError('Request Expired'));
        }
    } catch (err) {
        next(err);
    }
    next();
}

module.exports = validateRecentRequest;