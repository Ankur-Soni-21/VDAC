const Log = require('../models/logger.model');
class LogQueueSystem {
    constructor(batchSize = 100, flushInterval = 5000) {
        this.queue = [];
        this.isProcessing = false;
        this.batchSize = batchSize;
        this.flushInterval = flushInterval;
        this.startAutoFlush();
    }

    addLog(logData) {
        this.queue.push(logData);
        if (this.queue.length >= this.batchSize) {
            this.flush();
        }
    }

    async flush() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;
        const batch = this.queue.splice(0, this.batchSize);

        try {
            await Log.insertMany(batch);
            console.log(`Processed ${batch.length} logs`);
        } catch (error) {
            console.error('Error processing logs:', error);
            //empty the queue and add only one of the the failed batch logs to the front
            this.queue = [];
            this.queue.push(batch[0]);
        } finally {
            this.isProcessing = false;
        }
    }

    startAutoFlush() {
        setInterval(() => this.flush(), this.flushInterval);
    }
}

const logQueue = new LogQueueSystem();


module.exports = logQueue;