const youtubedl = require('youtube-dl-exec');
const createError = require('http-errors');
const { processVidInfo } = require('../utils/youtube/proc-youtube-info.util');
const logQueue = require('../utils/log-queue.util');
// const { cacheVideoInfo } = require("../utils/redisCacheSystem.util");

const handleAddLog = async (log, success, response) => {
    log.success = success;
    log.response = response;
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
        console.log("Request received");
        const videoInfo = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
            skipDownload: true,
        });


        console.log("Request processed");
        const processedInfo = processVidInfo(videoInfo);
        // cacheVideoInfo(req.redis, req.videoKey, url, processedInfo);
        handleAddLog(log, true, processedInfo);
        res.status(200).json(processedInfo);

    } catch (err) {
        handleAddLog(log, false, err.message || err || 'Unknown Error');
        console.log('Error in handleGetYoutubeVideo', err);
        if (err.message.includes('Video unavailable')) {
            next(createError(404, 'Video unavailable'));
        } else {
            next(createError(500, 'Internal Server Error'));
        }
    }
};

module.exports = handleGetYoutubeVideo;