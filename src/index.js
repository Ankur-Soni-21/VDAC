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

// Load environment variables from .env file
dotenv.config();
const PORT = process.env.PORT || 5000; // Set the port from environment variable or default to 5000
const MONGO_URI = process.env.MONGO_URI; // MongoDB connection URI from environment variable

const app = express();

// Middleware setup
app.use(bodyParser.json()); // Parse incoming request bodies in a middleware before handlers
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Health check route
app.use('/api/health', (req, res) => {
    res.status(200).send('Server is running'); // Respond with a 200 status if the server is running
});

// Video routes with validation middlewares
app.use('/api/v1/video', validateRecentRequest, validateUrl, verifySignature, videoRouter);

// Global error handler middleware
app.use(errorHandler);

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URI); // Connect to MongoDB
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`); // Start the server and listen on the specified port
        });
    } catch (err) {
        console.error('Failed to connect', err); // Log any connection errors
    }
};

// Initialize the server
startServer();