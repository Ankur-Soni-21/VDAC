const createError = require('http-errors');
const dotenv = require('dotenv');
const CryptoJS = require('crypto-js');

dotenv.config();
const secret = process.env.SECRET_KEY;

/**
 * Brief Description:
 * - Generates a signature using URL, timestamp, and a secret key.
 * - Verifies the signature of incoming requests to ensure authenticity.
 * - Throws errors for invalid parameters or mismatched signatures.
 */

const generateSignature = (url, ts) => {
    try {
        if (!url || !ts) {
            throw createError(404, 'Invalid Parameters');
        }
        // Concatenate URL, timestamp to create data string
        const data = `${url}${ts}${secret}`;
        // Generate AES of the data string
        return CryptoJS.SHA256(data).toString();
    } catch (err) {
        throw err;
    }
}

const verifySignature = (req, res, next) => {
    try {
        // Check if request body exists
        if (!req.body) {
            throw createError(404, 'Invalid Request');
        }
        // Check if URL, timestamp, and signature are provided in the request body
        else if (!req.body.url || !req.body.ts || !req.body._s) {
            throw createError(404, 'Invalid Parameters');
        }


        const { url, ts, _s } = req.body;
        // Generate the expected signature using the provided URL and timestamp
        const expectedSignature = generateSignature(url, ts);
        console.log('Signature: ', expectedSignature);
        // Compare the provided signature with the expected signature
        if (_s !== expectedSignature) {
            next(createError(404, 'Invalid Signature : ' + _s + ' Expected Signature: ' + expectedSignature));
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
    next();
}

module.exports = verifySignature;