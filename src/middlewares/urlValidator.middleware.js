const { URL } = require('url');
const createError = require('http-errors');
const sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

const validateYouTubeUrl = async (req, res, next) => {
    try {
        // Check if URL is provided
        if (!req.body.url) {
            return next(createError(400, 'URL is required'));
        }
        const { url } = req.body;
        // Sanitize URL
        const sanitizedURL = sanitizeUrl(url);

        // Validate URL format
        const parsedUrl = new URL(sanitizedURL);
        if (!parsedUrl.hostname.includes('youtube.com') && !parsedUrl.hostname.includes('youtu.be')) {
            return next(createError(400, 'Invalid YouTube URL'));
        }

        // Add sanitized URL to the request object
        req.body.url = sanitizedURL;
        next();
    } catch (err) {
        next(createError(500, 'Internal Server Error'));
    }
};

module.exports = validateYouTubeUrl;