const createError = require('http-errors');
require('dotenv').config();

/**
 * Brief Description:
 * - Validates the timestamp of incoming requests to ensure they are recent.
 * - Uses an expiry time from environment variables or defaults to 5 minutes.
 * - Throws errors for invalid requests or expired timestamps.
 */

const validateRecentRequest = async (req, res, next) => {
    try {
        // 5 minutes before request expires by default
        const REQUEST_EXPIRY = process.env.REQUEST_EXPIRY || 300;

        // Check if request body exists
        if (!req.body)
            throw createError(404, 'Invalid Request');

        // Check if timestamp (ts) is provided in the request body
        else if (!req.body.ts)
            throw createError(404, 'Invalid Parameters');

        const { ts } = req.body;
        const now = Math.floor(Date.now() / 1000);

        // Validate if the request timestamp is within the allowed expiry time
        if (now - ts > REQUEST_EXPIRY || ts > now) {
            next(createError('Request Expired'));
        }
    } catch (err) {
        // Handle any errors that occur during validation
        next(err);
    }
    next();
}

module.exports = validateRecentRequest;