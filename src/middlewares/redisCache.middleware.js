require('dotenv').config();
const createError = require('http-errors');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const redisCache = async (req, res, next) => {
  try {
    if (!process.env.REDIS_URL) {
      // console.log('REDIS_URL is not defined in .env file');
      throw createError(500, 'REDIS_URL is not defined in .env file');
    }

    const videokey = `video_info:${req.body.url}`;
    const videoData = await redis.get(videokey);

    if (videoData) {
      await redis.zadd('recent_videos', Date.now(), req.url);
      await redis.zincrby('video_freq', 1, url);
      return res.status(200).json(JSON.parse(videoData));
    }
    else {
      console.log('Cache miss');
    }

    // Attach redis client to the request object for later use
    req.redis = redis;
    req.videokey = videokey;
    next();
  } catch (error) {
    // console.error('Redis cache error:', error);
    next(error);
  }
};

module.exports = redisCache;