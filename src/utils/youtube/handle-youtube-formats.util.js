// const fs = require('fs')
const createError = require('http-errors');
const procVidFormats = (formats) => {
    try {
        if (!formats)
            return createError(404, 'Video Formats not found');

        let videoFormatsWithAudio = [];
        let videoFormats = [];
        let audioFormats = [];

        formats.forEach(format => {
            if (!format.protocol.includes('m3u8')) {
                if (format.vcodec !== 'none' && format.height >= 360 && (format.vcodec.includes('avc1') || format.vcodec.includes('vp09'))) {
                    if (format.acodec !== 'none') {
                        videoFormatsWithAudio.push(format)
                    } else {
                        videoFormats.push(format)
                    }
                } else if (format.acodec !== 'none') {
                    audioFormats.push(format)
                }
            }
        })
        // Combine and sort video formats
        videoFormats.sort((a, b) => b.height - a.height)
        videoFormats = videoFormatsWithAudio.concat(videoFormats)
        // fs.writeFileSync('./audioFormats1.json', JSON.stringify(audioFormats, null, 2));
        // fs.writeFileSync('./videoFormats1.json', JSON.stringify(videoFormats, null, 2));

        // Filter and sort audio formats
        const opusFormats = audioFormats.filter(format => format.audio_ext === 'webm').sort((a, b) => b.abr - a.abr).slice(0, 3);
        const mp4aFormats = audioFormats.filter(format => format.audio_ext === 'm4a').sort((a, b) => b.abr - a.abr).slice(0, 1);

        // Combine the selected audio formats
        audioFormats = [...opusFormats, ...mp4aFormats];

        // fs.writeFileSync('./videoFormats2.json', JSON.stringify(videoFormats, null, 2));
        // fs.writeFileSync('./audioFormats2.json', JSON.stringify(audioFormats, null, 2));


        // Return the combined video and audio formats
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
        if (!err.status)
            throw createError(500, 'Internal Server Error');
    }
}

module.exports = procVidFormats