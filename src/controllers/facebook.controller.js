const createError = require('http-errors');
const logQueue = require('../utils/log-queue.util');
const facebookdl = require('../utils/facebook/facebook-dl.util');

/**
 * Brief Description:
 * - Handles adding logs to the log queue.
 * - Fetches and processes Facebook video information.
 * - Logs the request and response details.
 * - Handles errors and sends appropriate HTTP responses.
 */

const handleAddLog = async (log, success, response) => {
    // Update log object with success status and response
    log.success = success;
    log.response = response;
    // Add log to the log queue
    logQueue.addLog(log);
    console.log('Log added to queue');
}

const handleGetFacebookVideo = async (req, res, next) => {
    const { url } = req.body;
    const log = {
        ipAddress: req.ip,
        timestamp: req.body.ts,
        signature: req.body._s,
        url: req.body.url,
        success: true,
        responseTime: Date.now() / 1000 - req.body.ts,
        response: null
    };

    try {
        // Fetch video information using facebook-dl.util
        const videoInfo = await facebookdl(url);
        // Add successful log entry
        handleAddLog(log, true, videoInfo);
        // Send video information as JSON response
        res.status(200).json(videoInfo);
    } catch (err) {
        console.log(err);
        // Add failed log entry
        handleAddLog(log, false, err);
        // Handle errors and send appropriate HTTP responses
        if (err) {
            next(createError(404, err));
        } else {
            next(createError(500, 'Internal Server Error'));
        }
    }
}

module.exports = handleGetFacebookVideo;