const express = require('express');
const videoRouter = express.Router();
const handleGetYoutubeVideo = require('../controllers/youtube.controller');
const handleGetFacebookVideo = require("../controllers/facebook.controller");
const handleGetYoutubeTranscript = require("../controllers/youtube-ts.controller")
// const handleGetInstagramVideoOrPost = require("../controllers/instagram.controller");

videoRouter.post("/yt", handleGetYoutubeVideo);
videoRouter.post("/yt/ts", handleGetYoutubeTranscript);
// videoRouter.post("/insta", handleGetInstagramVideoOrPost);
videoRouter.post("/fb", handleGetFacebookVideo);
// videoRouter.post("/x", handleGetVideoInfo);

module.exports = videoRouter;