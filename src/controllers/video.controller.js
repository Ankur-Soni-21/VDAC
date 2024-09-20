const { processVidInfo } = require('../utils/videoInfoProcessor.util');
const Log = require('../models/logger.model');
const youtubedl = require('youtube-dl-exec');

const handleGetVideoInfo = async (req, res, next) => {
    const startTime = Date.now();
    const log = {
        ipAddress: req.ip,
        signature: req.body._s,
        url: req.body.url,
        success: true,
        responseTime: 0,
        response: null
    };

    try {
        const { url } = req.body;
        const youtubedlPromise = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
            skipDownload: true,
        });

        const processedInfo = processVidInfo(youtubedlPromise);
        log.success = true;
        log.response = processedInfo;
        log.responseTime = (Date.now() - startTime) / 1000;

        // Save log to database
        await Log.create(log);

        res.status(200).json(processedInfo);
    } catch (err) {
        log.success = false;
        log.responseTime = (Date.now() - startTime) / 1000;
        log.response = { error: err.message };
        await Log.create(log);

        res.status(500).json({ error: err.message });
    }
};

module.exports = { handleGetVideoInfo };