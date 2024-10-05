const MAX_CACHE_SIZE = 10; // Maximum number of videos to cache
const CACHE_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

export const cacheVideoInfo = async (redis, videoKey, url, videoInfo) => {
    try {
        if (!redis || videoInfo || videoKey || url)
            throw new Error('Missing required parameters');
        const multi = redis.multi();

        multi.setex(videoKey, CACHE_EXPIRY, JSON.stringify(videoInfo));

        multi.zadd('recent_videos', Date.now(), url);
        multi.zincrby('video_freq', 1, url);

        const cacheSize = await redis.zcard('recent_videos');

        if (cacheSize >= MAX_CACHE_SIZE) {
            const leastVal = await findLeastValVideo(redis);
            if (leastVal) {
                multi.zrem('recent_videos', leastVal);
                multi.zrem('video_freq', leastVal);
                multi.del(`video:${leastVal}`);
            }
        }
        await multi.exec();
    }
    catch (err) {
        throw err;
    }
}

const findLeastValVideo = async (redis) => {
    const leastFreq = await redis.zrange('video_freq', 0, 0, 'WITHSCORES');
    if (leastFreq.length === 0) return null;

    const [leastFreqUrl, freq] = leastFreq;

    if (parseInt(freq) > 1) {
        return redis.zrange('recent_videos', 0, 0);
    }

    return leastFreqUrl;
}

export { cacheVideoInfo };