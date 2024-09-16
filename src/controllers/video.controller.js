const youtubedl = require('youtube-dl-exec');
const createError = require('http-errors');
const logger = require('progress-estimator')();
const { processVidInfo } = require('../utils/videoInfoProcessor.util');

const handleGetVideoInfo = async (req, res, next) => {
    const { url } = req.body;
    console.log('url', url);

    try {
        const youtubedlPromise = youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
            skipDownload: true,
        });
        const videoInfo = await logger(youtubedlPromise, `Fetching info for ${url}`);
        const processedInfo = processVidInfo(videoInfo);
        res.status(200).json(processedInfo);
    } catch (err) {
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