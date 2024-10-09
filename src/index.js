const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes and middlewares
const videoRouter = require('./routes/video.route');
const errorHandler = require('./middlewares/error-handler.middleware');
const validateUrl = require("./middlewares/url-validator.middleware");
const validateRecentRequest = require("./middlewares/request-validator.middleware");
const verifySignature = require("./middlewares/signature-validator.middleware");

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());


// Routes
app.use('/api/health', (req, res) => {
    res.status(200).send('Server is running');
});
app.use('/api/v1/video', validateRecentRequest, validateUrl, verifySignature, videoRouter);
app.use(errorHandler);

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        // console.log('Connected to MongoDB : ', MONGO_URI);
        // console.log('Secret key : ', process.env.SECRET_KEY);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect', err);
    }
};

startServer();