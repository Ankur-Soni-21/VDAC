const procVidFormats = require('./videoFormatProcessor.util');
const createError = require('http-errors');

const processVidInfo = (videoInfo) => {
    try {
        if (!videoInfo)
            return createError(404, 'Video Info not found');
        const videoFormats = procVidFormats(videoInfo.formats);
        return {
            id: videoInfo.id,
            cipher: false,
            meta: {
                title: videoInfo.title,
                source: videoInfo.webpage_url,
                duration: formatDuration(videoInfo.duration),
                tags: videoInfo.tags ? videoInfo.tags.join(',') : '',
            },
            thumb: videoInfo.thumbnail,
            itags: videoFormats.map(format => format.itag),
            video_quality: [...new Set(videoFormats
                .filter(format => format.audio === false)
                .map(format => format.quality))],
            url: videoFormats,
        }
    } catch (err) {
        if (!err.status)
            throw createError(500, 'Internal Server Error');
        else
            throw err;
    }
}

function formatDuration(duration) {
    try {
        if (!duration)
            throw createError(404, 'Duration not found');
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch (err) {
        if (!err.status)
            throw createError(500, 'Internal Server Error');
    }
}

module.exports = {
    processVidInfo,
};