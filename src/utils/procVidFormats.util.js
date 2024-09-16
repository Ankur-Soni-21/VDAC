const procVidFormats = (formats) => {
    const videoFormats = formats.filter(format =>
        format.vcodec !== 'none' &&
        format.height >= 360 &&
        !format.protocol.includes('m3u8')
    );

    const audioFormats = formats.filter(format =>
        format.vcodec === 'none' &&
        format.acodec !== 'none' &&
        !format.protocol.includes('m3u8')
    );

    const sortedVideoFormats = videoFormats.sort((a, b) => {
        const aHasVideoAndAudio = a.vcodec !== 'none' && a.acodec !== 'none';
        const bHasVideoAndAudio = b.vcodec !== 'none' && b.acodec !== 'none';

        if (aHasVideoAndAudio && !bHasVideoAndAudio) {
            return -1;
        } else if (!aHasVideoAndAudio && bHasVideoAndAudio) {
            return 1;
        } else {
            return 0;
        }
    });


    const extractCodecType = (codec) => {
        if (codec.includes('avc1')) {
            return true;
        } else if (codec.includes('vp09'))
            return true;
        return false;
    };

    const sortedAudioFormats = audioFormats.sort((a, b) => (b.abr || 0) - (a.abr || 0));
    const bestAudioFormat = sortedAudioFormats[0];
    const otherAudioFormats = sortedAudioFormats.slice(1);

    return [
        ...sortedVideoFormats
            .filter(format => extractCodecType(format.vcodec) === true)
            .map(format => ({
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
                isBundle: false,
                isOtf: false,
                isDrm: false,
                filesize: format.filesize || 0,
                attr: {
                    title: `Video format: ${format.height}p`,
                    class: format.acodec !== 'none' ? 'video-with-audio' : 'only-video'
                }
            })),
        {
            url: bestAudioFormat.url,
            name: 'Audio',
            subname: 'Best quality',
            type: bestAudioFormat.ext,
            ext: bestAudioFormat.ext,
            downloadable: true,
            quality: 'Best',
            qualityNumber: bestAudioFormat.abr || 0,
            contentLength: bestAudioFormat.filesize || null,
            videoCodec: 'none',
            audioCodec: bestAudioFormat.acodec,
            audio: true,
            no_audio: false,
            itag: bestAudioFormat.format_id,
            isBundle: false,
            isOtf: false,
            isDrm: false,
            filesize: bestAudioFormat.filesize || 0,
            attr: {
                title: `Audio format: ${bestAudioFormat.abr}kbps`,
                class: 'audio-only(BEST)'
            }
        },
        ...otherAudioFormats.map(format => ({
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
            isOtf: false,
            isDrm: false,
            filesize: format.filesize || 0,
            attr: {
                title: `Audio format: ${format.abr}kbps`,
                class: 'audio-only'
            }
        }))
    ];
};

module.exports = {
    procVidFormats
};