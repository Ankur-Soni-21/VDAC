const youtubedl = require('youtube-dl-exec');
const createError = require('http-errors');
const { processVidInfo } = require('../utils/procVidInfo.util');
// const fs = require('fs');

const handleGetVideoInfo = async (req, res, next) => {
    const { url } = req.body;
    console.log('url', url);

    try {
        const videoInfo = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot']
        });

        // Optionally save the raw output for debugging
        // fs.writeFileSync('./videoInfo.json', JSON.stringify(videoInfo, null, 2));

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