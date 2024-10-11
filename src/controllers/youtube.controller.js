const youtubedl = require('youtube-dl-exec');
const createError = require('http-errors');
const { processVidInfo } = require('../utils/youtube/proc-youtube-info.util');
const logQueue = require('../utils/log-queue.util');

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
        const videoInfo = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
            skipDownload: true,
        });



        const processedInfo = processVidInfo(videoInfo);
        handleAddLog(log, true, processedInfo);
        res.status(200).json(processedInfo);

    } catch (err) {
        console.log(err);
        handleAddLog(log, false, err);
        if (err.stderr) {
            next(createError(404, err.stderr));
        } else {
            next(createError(500, 'Internal Server Error'));
        }
    }
};

module.exports = handleGetYoutubeVideo;