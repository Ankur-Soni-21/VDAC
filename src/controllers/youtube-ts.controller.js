const createError = require('http-errors');
const logQueue = require('../utils/log-queue.util');
const { YoutubeTranscript } = require("youtube-transcript")


const handleAddLog = async (log, success, response) => {
    log.success = success;
    log.response = response;
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

        const transcript = await YoutubeTranscript.fetchTranscript(url)
            .then(transcript => {
                return transcript;
            });

        const paraTranscript = transcript.map(item => item.text).join(' ');
        // console.log(paraTranscript);
        const result = {
            transcript_text: paraTranscript,
            transcript_json: transcript
        }

        console.log("Request processed");
        handleAddLog(log, true, transcript);
        res.status(200).json(result);

    } catch (err) {
        // handleAddLog(log, false, err.message);
        console.log('Error in handleGetVideoInfo', err);
        if (err.message.includes('Video unavailable')) {
            next(createError(404, 'Video unavailable'));
        } else {
            next(createError(500, 'Internal Server Error'));
        }
    }
}

module.exports = handleGetYoutubeTranscript;