// Import the Log model from the logger.model file
const Log = require('../models/logger.model');

/**
 * Brief Description:
 * - Manages a queue system for logging.
 * - Adds logs to the queue and processes them in batches.
 * - Handles errors during log processing.
 */

// Define the LogQueueSystem class to handle log batching and flushing
class LogQueueSystem {
    // Constructor to initialize the log queue system with optional batch size and flush interval
    constructor(batchSize = 100, flushInterval = 5000) {
        this.queue = []; // Initialize an empty queue to store logs
        this.isProcessing = false; // Flag to indicate if logs are being processed
        this.batchSize = batchSize; // Set the batch size for log processing
        this.flushInterval = flushInterval; // Set the interval for automatic flushing
        this.startAutoFlush(); // Start the automatic flushing mechanism
    }

    // Method to add a log to the queue
    addLog(logData) {
        this.queue.push(logData); // Add the log data to the queue
        if (this.queue.length >= this.batchSize) { // Check if the queue has reached the batch size
            this.flush(); // Flush the queue if the batch size is reached
        }
    }

    // Method to flush the logs from the queue
    async flush() {
        if (this.isProcessing || this.queue.length === 0) return; // Exit if already processing or queue is empty

        this.isProcessing = true; // Set the processing flag to true
        const batch = this.queue.splice(0, this.batchSize); // Extract a batch of logs from the queue

        try {
            await Log.insertMany(batch); // Insert the batch of logs into the database
            console.log(`Processed ${batch.length} logs`); // Log the number of processed logs
        } catch (error) {
            console.error('Error processing logs:', error); // Log any errors that occur during processing
            // Empty the queue and add only one of the failed batch logs to the front
            this.queue = [];
            this.queue.push(batch[0]);
        } finally {
            this.isProcessing = false; // Reset the processing flag
        }
    }

    // Method to start the automatic flushing mechanism
    startAutoFlush() {
        setInterval(() => this.flush(), this.flushInterval); // Set an interval to flush the queue automatically
    }
}

// Create an instance of the LogQueueSystem
const logQueue = new LogQueueSystem();

// Export the logQueue instance for use in other parts of the application
module.exports = logQueue;