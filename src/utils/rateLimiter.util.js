const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS,
  max: process.env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  headers: true,
});

module.exports = limiter;