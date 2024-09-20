const express = require('express');
const createError = require('http-errors');
const videoRouter = express.Router();
const { handleGetVideoInfo } = require('../controllers/video.controller');

try {
    if (!handleGetVideoInfo)
        throw createError(500, 'Controller not found');
    videoRouter.post("/video-info", handleGetVideoInfo);

} catch (err) {
    throw err;
}

module.exports = videoRouter;