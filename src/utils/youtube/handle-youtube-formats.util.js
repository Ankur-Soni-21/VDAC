// Import the 'http-errors' module to create HTTP errors
const createError = require('http-errors');

// Define the procVidFormats function which processes video formats
const procVidFormats = (formats) => {
    try {
        // If formats is not provided, return a 404 error
        if (!formats)
            return createError(404, 'Video Formats not found');

        // Initialize arrays to hold different types of formats
        let videoFormatsWithAudio = [];
        let videoFormats = [];
        let audioFormats = [];

        // Iterate over each format in the formats array
        formats.forEach(format => {
            // Exclude formats with 'm3u8' protocol
            if (!format.protocol.includes('m3u8')) {
                // Check if the format is a video with a codec and resolution of at least 360p
                if (format.vcodec !== 'none' && format.height >= 360 && (format.vcodec.includes('avc1') || format.vcodec.includes('vp09'))) {
                    // If the format also has an audio codec, add it to videoFormatsWithAudio
                    if (format.acodec !== 'none') {
                        videoFormatsWithAudio.push(format)
                    } else {
                        // Otherwise, add it to videoFormats
                        videoFormats.push(format)
                    }
                } else if (format.acodec !== 'none') {
                    // If the format is audio-only, add it to audioFormats
                    audioFormats.push(format)
                }
            }
        })
        
        // Sort video formats by height in descending order
        videoFormats.sort((a, b) => b.height - a.height)
        // Combine video formats with audio and video-only formats
        videoFormats = videoFormatsWithAudio.concat(videoFormats)

        // Filter and sort audio formats with 'webm' extension by bitrate in descending order, and take the top 3
        const opusFormats = audioFormats.filter(format => format.audio_ext === 'webm').sort((a, b) => b.abr - a.abr).slice(0, 3);
        // Filter and sort audio formats with 'm4a' extension by bitrate in descending order, and take the top 1
        const mp4aFormats = audioFormats.filter(format => format.audio_ext === 'm4a').sort((a, b) => b.abr - a.abr).slice(0, 1);

        // Combine the selected audio formats
        audioFormats = [...opusFormats, ...mp4aFormats];

        // Return the combined video and audio formats with additional metadata
        return [
            ...videoFormats.map(format => ({
                url: format.url,
                name: `${format.height}p`,
                subname: format.fps ? `${format.fps}fps` : '',
                type: format.ext,
                ext: format.ext,
                downloadable: true,
                quality: `${format.height}p`,
                qualityNumber: format.height,
                contentLength: format.filesize || null,
                videoCodec: format.vcodec,
                audioCodec: format.acodec,
                audio: format.acodec !== 'none',
                no_audio: format.acodec === 'none',
                itag: format.format_id,
                isBundle: format.acodec !== 'none',
                filesize: format.filesize || 0,
                attr: {
                    title: `Video format: ${format.height}p`,
                    class: format.acodec !== 'none' ? 'video-with-audio' : 'only-video'
                }
            })),
            ...audioFormats.map(format => ({
                url: format.url,
                name: 'Audio',
                subname: `${format.abr}kbps`,
                type: format.ext,
                ext: format.ext,
                downloadable: true,
                quality: `${format.abr}kbps`,
                qualityNumber: format.abr || 0,
                contentLength: format.filesize || null,
                videoCodec: 'none',
                audioCodec: format.acodec,
                audio: true,
                no_audio: false,
                itag: format.format_id,
                isBundle: false,
                filesize: format.filesize || 0,
                attr: {
                    title: `Audio format: ${format.abr}kbps`,
                    class: 'audio-only'
                }
            }))
        ]

    } catch (err) {
        // If an error occurs and it doesn't have a status, throw a 500 Internal Server Error
        if (!err.status)
            throw createError(500, 'Internal Server Error');
    }
}

// Export the procVidFormats function as a module
module.exports = procVidFormats