// Import the required modules
const procVidFormats = require('./handle-youtube-formats.util');
const createError = require('http-errors');


/**
 * Brief Description:
 * - Processes YouTube video information.
 * - Formats video duration and extracts relevant metadata.
 * - Handles errors and throws appropriate HTTP responses.
 */

// Function to process video information
const processVidInfo = (videoInfo) => {
    try {
        // Check if videoInfo is provided
        if (!videoInfo)
            return createError(404, 'Video Info not found');

        // Process video formats
        const videoFormats = procVidFormats(videoInfo.formats);

        // Return the processed video information
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
        // Handle errors and throw appropriate HTTP errors
        if (!err.status)
            throw createError(500, 'Internal Server Error');
        else
            throw err;
    }
}

// Function to format video duration from seconds to HH:MM:SS
function formatDuration(duration) {
    try {
        // Check if duration is provided
        if (!duration)
            throw createError(404, 'Duration not found');

        // Calculate hours, minutes, and seconds
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;

        // Return formatted duration
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch (err) {
        // Handle errors and throw appropriate HTTP errors
        if (!err.status)
            throw createError(500, 'Internal Server Error');
    }
}

// Export the processVidInfo function
module.exports = {
    processVidInfo,
};