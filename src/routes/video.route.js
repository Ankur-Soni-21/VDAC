const express = require('express');
const videoRouter = express.Router();
const handleGetYoutubeInfo = require('../controllers/youtube.controller');

videoRouter.post("/yt", handleGetYoutubeInfo);
// videoRouter.post("/insta", handleGetVideoInfo);
// videoRouter.post("/fb", handleGetVideoInfo);
// videoRouter.post("/x", handleGetVideoInfo);

module.exports = videoRouter;