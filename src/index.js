const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const videoRouter = require('./routes/video.route');
const errorHandler = require('./middlewares/errorHandler.middleware');
const validateUrl = require("./middlewares/urlValidator.middleware");
const validateRecentRequest = require("./middlewares/recentRequestValidator.middleware");
const verifySignature = require("./middlewares/signatureValidator.middleware");

// Load environment variables
dotenv.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(validateRecentRequest);


// Routes
app.use('/api/v1/video', validateUrl, verifySignature, videoRouter);
app.use(errorHandler);

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

startServer();
