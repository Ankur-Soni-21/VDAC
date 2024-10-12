const { URL } = require('url');
const createError = require('http-errors');
const sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

/**
 * Brief Description:
 * - Validates and sanitizes URLs in incoming requests.
 * - Ensures the URL is provided and belongs to an accepted hostname.
 * - Attaches the sanitized URL back to the request object.
 * - Handles errors during the validation process.
 */

const validateYouTubeUrl = async (req, res, next) => {
    try {
        // Check if URL is provided in the request body
        if (!req.body.url) {
            return next(createError(400, 'URL is required'));
        }
        const { url } = req.body;

        // Sanitize the provided URL to remove any potentially harmful content
        const sanitizedURL = sanitizeUrl(url);

        // Parse the sanitized URL to validate its format
        const parsedUrl = new URL(sanitizedURL);

        // List of accepted hostnames for validation
        const acceptedHostnames = [
            'youtube.com',
            'youtu.be',
            'facebook.com',
            'fb.watch',
            'instagram.com'
        ];

        // Check if the hostname of the parsed URL is in the list of accepted hostnames
        const isValidHostname = acceptedHostnames.some(hostname => parsedUrl.hostname.includes(hostname));
        if (!isValidHostname) {
            return next(createError(400, 'Invalid URL'));
        }

        // Attach the sanitized URL back to the request object
        req.body.url = sanitizedURL;
        next();
    } catch (err) {
        // Handle any errors that occur during validation
        next(createError(500, 'Internal Server Error'));
    }
};

module.exports = validateYouTubeUrl;