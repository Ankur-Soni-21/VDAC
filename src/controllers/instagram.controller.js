const { igApi, getCookie } = require("insta-fetcher");
const createError = require('http-errors');
const logQueue = require('../utils/log-queue.util');
const handleInstaVideoFormats = require("../utils/instagram/handle-insta-formats.util");
require('dotenv').config();

const insta_usr = process.env.INSTA_USR;
const insta_pwd = process.env.INSTA_PWD;
let COOKIE = null;
let COOKIE_EXPIRY = null;

const genLog = async (req) => {
    const log = {
        ipAddress: req.ip,
        timestamp: req.body.ts,
        signature: req.body._s,
        url: req.body.url,
        success: true,
        responseTime: Date.now() / 1000 - req.body.ts,
        response: null
    };
    return log;
}

const handleAddLog = async (log, success, response) => {
    log.success = success;
    log.response = response;
    logQueue.addLog(log);
    console.log('Log added to queue');
}

const throwError = (err, next) => {
    console.log('Error in handleGetInstagramVideoOrPost');
    if (err.message.includes('Video unavailable')) {
        next(createError(404, 'Video unavailable', err));
    } else {
        next(createError(500, 'Internal Server Error', err));
    }
}

const handleCookie = async () => {
    if (!insta_usr || !insta_pwd)
        throw createError(500, 'Internal Server Error');

    const newCookie = await getCookie(insta_usr, insta_pwd);
    COOKIE = newCookie;
    COOKIE_EXPIRY = Date.now() + 10 * 60 * 1000; // 10 minutes
    return COOKIE;
}

const fetchCookie = async () => {
    if (!COOKIE || !COOKIE_EXPIRY || Date.now() > COOKIE_EXPIRY) {
        return handleCookie();
    }
    return COOKIE;
}


const handleGetInstagramVideoOrPost = async (req, res, next) => {
    const { url } = req.body;
    const log = await genLog(req);
    try {

        const cookie = await fetchCookie();
        const ig = new igApi(cookie);
        const respose = await ig.fetchPost(url).then(res => { return res; }).catch(err => { err.message = "Video unavailable"; throw err; });
        const result = handleInstaVideoFormats(respose);
        // console.log(result);

        await handleAddLog(log, true, result);
        res.status(200).json(result);

    } catch (err) {
        handleAddLog(log, false, err.message || 'failed');
        throwError(err, next);
    }
};

module.exports =
    handleGetInstagramVideoOrPost
