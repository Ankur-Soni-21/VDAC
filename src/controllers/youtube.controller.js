const youtubedl = require('youtube-dl-exec');
const createError = require('http-errors');
const { processVidInfo } = require('../utils/youtube/proc-youtube-info.util');
const logQueue = require('../utils/log-queue.util');

/**
 * Brief Description:
 * - Handles adding logs to the log queue.
 * - Fetches and processes YouTube video information.
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

const handleGetYoutubeVideo = async (req, res, next) => {
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
        // Fetch video information using youtube-dl-exec
        const videoInfo = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
            skipDownload: true,
        });

        // Process the fetched video information
        const processedInfo = processVidInfo(videoInfo);
        // Add successful log entry
        handleAddLog(log, true, processedInfo);
        // Send processed video information as JSON response
        res.status(200).json(processedInfo);

    } catch (err) {
        console.log(err);
        // Add failed log entry
        handleAddLog(log, false, err);
        // Handle errors and send appropriate HTTP responses
        if (err.stderr) {
            next(createError(404, err.stderr));
        } else {
            next(createError(500, 'Internal Server Error'));
        }
    }
};

module.exports = handleGetYoutubeVideo;