// YET TO BUILD
//! ISSUE : INSTAGRAM REQUIRES AUTHENTICATION TO ACCESS ANY DATA

// const instagramdl = require("../utils/instagram/instagram-dl.util");
// const createError = require('http-errors');
// const handleInstaVideoFormats = require('../utils/instagram/handle-insta-formats.util');
// const logQueue = require('../utils/log-queue.util');

// const handleAddLog = async (log, success, response) => {
//     log.success = success;
//     log.response = response;
//     logQueue.addLog(log);
//     console.log('Log added to queue');
// }

// const handleGetInstagramVideo = async (req, res, next) => {
//     const { url } = req.body;
//     const log = {
//         ipAddress: req.ip,
//         timestamp: req.body.ts,
//         signature: req.body._s,
//         url: req.body.url,
//         success: true,
//         responseTime: Date.now() / 1000 - req.body.ts,
//         response: null
//     };

//     try {
//         const videoInfo = await instagramdl(url);
//         const processedInfo = handleInstaVideoFormats(videoInfo);
//         handleAddLog(log, true, processedInfo);
//         res.status(200).json(processedInfo);

//     } catch (err) {
//         handleAddLog(log, false, err.message);
//         if (err.message.includes('Video unavailable')) {
//             next(createError(404, 'Video unavailable'));
//         } else {
//             next(createError(500, 'Internal Server Error'));
//         }
//     }
// }

// module.exports = handleGetInstagramVideo;