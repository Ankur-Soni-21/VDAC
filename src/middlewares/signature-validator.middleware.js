const createError = require('http-errors');
const crypto = require('crypto');
const dotenv = require('dotenv');


dotenv.config();
const secret = process.env.SECRET_KEY;


const generateSignature = (url, ts) => {
    try {
        if (!url || !ts) {
            throw createError(404, 'Invalid Parameters');
        }
        // console.log("URL: ", url);
        // console.log("TS: ", ts);
        // console.log("SECRET: ", secret);
        const data = url + ts + secret;
        const hash = crypto.createHash('md5')
            .update(data)
            .digest('hex');
        return hash;
    } catch (err) {
        throw err;
    }

}

const verifySignature = (req, res, next) => {
    // console.log(req.body)
    try {
        if (!req.body) {
            throw createError(404, 'Invalid Request');
        }
        else if (!req.body.url || !req.body.ts || !req.body._s) {
            throw createError(404, 'Invalid Parameters');
        }

        const { url, ts, _s } = req.body;
        const expectedSignature = generateSignature(url, ts);
        // console.log("Expected Signature: ", expectedSignature);
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