const express = require('express');
const videoRouter = express.Router();
const {handleGetVideoInfo} = require('../controllers/video.controller');

videoRouter.post("/video-info", handleGetVideoInfo);

module.exports = videoRouter;