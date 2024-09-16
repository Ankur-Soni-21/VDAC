const { procVidFormats } = require('./procVidFormats.util');

const processVidInfo = (videoInfo) => {
    const videoFormats = procVidFormats(videoInfo.formats);
    return {
        id: videoInfo.id,
        cipher: false,
        meta: {
            title: videoInfo.title,
            source: videoInfo.webpage_url,
            duration: formatDuration(videoInfo.duration),
            tags: videoInfo.tags ? videoInfo.tags.join(',') : '',
            subtitle: {
                token: generateToken(),
                language: videoInfo.subtitles ? Object.keys(videoInfo.subtitles) : []
            }
        },
        thumb: videoInfo.thumbnail,
        converterUI: [],
        itags: videoFormats.map(format => format.itag),
        video_quality: [...new Set(videoFormats
            .filter(format => format.audio === false)
            .map(format => format.quality))],
        url: videoFormats,
        mp3Converter: `https://example.com/mp3-converter/${videoInfo.id}`,
        hosting: "101",
        sd: null,
        hd: null,
    }
}

function formatDuration(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = {
    processVidInfo,
};