const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const videoRouter = require('./routes/video.route');
const errorHandler = require('./middlewares/errorHandler.middleware');
const rateLimiter = require('./middlewares/rateLimiter.middleware');
const validateUrl = require("./middlewares/validateURL");
const validateRecentRequest = require("./middlewares/verifyRecentRequest.middleware");
const verifySignature = require("./middlewares/verifySignature.middleware");

const app = express();

// Load environment variables
// Load environment variables
dotenv.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS;
const RATE_LIMIT_MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS;

// Validate environment variables
if (!PORT || !MONGO_URI || !RATE_LIMIT_WINDOW_MS || !RATE_LIMIT_MAX_REQUESTS) {
    throw new Error('Missing required environment variables');
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });



// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(rateLimiter);
app.use(validateRecentRequest);
//! All the error from controller will be handled by this middleware



// Routes
app.use('/api/v1/video', validateUrl, verifySignature,  videoRouter);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

