const createError = require('http-errors');
const crypto = require('crypto');
const secret = process.env.SECRET_KEY;


const generateSignature = (url, ts) => {
    const data = url + ts + secret;
    const hash = crypto.createHash('md5')
        .update(data)
        .digest('hex');
    return hash;
}

const verifySignature = (req, res, next) => {
    // console.log(req.body)
    const { url, ts, _s } = req.body;
    const expectedSignature = generateSignature(url, ts);
    // console.log("Expected Signature: ", expectedSignature);
    if (_s !== expectedSignature) {
        next(createError('Invalid Signature'));
    }
    next();
}

module.exports = verifySignature;