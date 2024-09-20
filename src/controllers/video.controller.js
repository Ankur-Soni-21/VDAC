const youtubedl = require('youtube-dl-exec');
const createError = require('http-errors');
// const logger = require('progress-estimator')();
const { processVidInfo } = require('../utils/videoInfoProcessor.util');
const logQueue = require('../utils/logQueue.util');
// const Log = require('../models/logger.model');

const handleGetVideoInfo = async (req, res, next) => {
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
        log.response = videoInfo;
        log.success = true;
        logQueue.addLog(log);
        // Log.create(log);
        const processedInfo = processVidInfo(videoInfo);
        res.status(200).json(processedInfo);
    } catch (err) {
        log.response = err;
        log.success = false;
        logQueue.addLog(log);
        // Log.create(log);
        console.log('Error in handleGetVideoInfo', err);
        if (err.message.includes('Video unavailable')) {
            next(createError(404, 'Video unavailable'));
        } else {
            next(createError(500, 'Internal Server Error'));
        }
    }
};

module.exports = {
    handleGetVideoInfo,
};