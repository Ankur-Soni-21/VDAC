const createError = require('http-errors');
const validateRecentRequest = async (req, res, next) => {
    try {
        if (!req.body)
            throw createError(404, 'Invalid Request');
        else if (!req.body.ts)
            throw createError(404, 'Invalid Parameters');

        const { ts } = req.body;
        const now = Math.floor(Date.now() / 1000);
        if (now - ts > 300 || ts > now) {
            next(createError('Request Expired'));
        }
    } catch (err) {
        next(err);
    }
    next();
}

module.exports = validateRecentRequest;