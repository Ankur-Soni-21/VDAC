const createError = require('http-errors');
const logQueue = require('../utils/log-queue.util');
const facebookdl = require('../utils/facebook/facebook-dl.util');

const handleAddLog = async (log, success, response) => {
    log.success = success;
    log.response = response;
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
        const videoInfo = await facebookdl(url);
        console.log("videoinfo:", videoInfo)
        handleAddLog(log, true, videoInfo);
        res.status(200).json(videoInfo);
    } catch (err) {
        console.log("Error in handleGetFacebookVideo: ", err);
        handleAddLog(log, false, err);
        next(createError(500, 'Internal Server Error'));
    }
}

module.exports = handleGetFacebookVideo;