const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    signature: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    },
    responseTime: {
        type: Number,
        required: true
    },
    response: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

const Log = mongoose.model('Logger', logSchema);
module.exports = Log;