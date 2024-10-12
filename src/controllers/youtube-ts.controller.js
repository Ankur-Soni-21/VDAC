const createError = require('http-errors');
const logQueue = require('../utils/log-queue.util');
const { YoutubeTranscript } = require("youtube-transcript");

/**
 * Brief Description:
 * - Handles adding logs to the log queue.
 * - Fetches and processes YouTube video transcripts.
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

const handleGetYoutubeTranscript = async (req, res, next) => {
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
        console.log("Request received");

        // Fetch transcript using youtube-transcript
        const transcript = await YoutubeTranscript.fetchTranscript(url)
            .then(transcript => {
                return transcript;
            });

        // Process the fetched transcript into a single paragraph
        const paraTranscript = transcript.map(item => item.text).join(' ');
        const result = {
            transcript_text: paraTranscript,
            transcript_json: transcript
        }

        console.log("Request processed");
        // Add successful log entry
        handleAddLog(log, true, transcript);
        // Send processed transcript as JSON response
        res.status(200).json(result);

    } catch (err) {
        console.log(err);
        // Add failed log entry
        handleAddLog(log, false, err);
        // Handle errors and send appropriate HTTP responses
        if (err.message) {
            next(createError(404, err.message));
        } else {
            next(createError(500, 'Internal Server Error'));
        }
    }
}

module.exports = handleGetYoutubeTranscript;