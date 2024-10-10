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

        // List of accepted hostnames
        const acceptedHostnames = [
            'youtube.com',
            'youtu.be',
            'facebook.com',
            'fb.watch',
            'instagram.com'
        ];

        // Check if the hostname is in the list of accepted hostnames
        const isValidHostname = acceptedHostnames.some(hostname => parsedUrl.hostname.includes(hostname));
        if (!isValidHostname) {
            return next(createError(400, 'Invalid URL'));
        }

        // Add sanitized URL to the request object
        req.body.url = sanitizedURL;
        next();
    } catch (err) {
        next(createError(500, 'Internal Server Error'));
    }
};

module.exports = validateYouTubeUrl;