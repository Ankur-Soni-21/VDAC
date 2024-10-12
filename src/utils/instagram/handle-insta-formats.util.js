// const createError = require('http-errors');
// const handleInstaVideoFormats = (videoInfo) => {
//     try {
//         if (!videoInfo)
//             return createError(404, 'Video Info not found');
//         return {
//             media_id: videoInfo.media_id,
//             meta: {
//                 username: videoInfo.username,
//                 postType: videoInfo.postType,
//                 postLikes: videoInfo.likes,
//                 postCaption: videoInfo.caption,
//                 postCommentCount: videoInfo.comment_count,
//                 postDuration: formatDuration(videoInfo.video_duration) || null,
//             },
//             url:
//             {
//                 postURL: videoInfo.links[0].url,
//                 postType: videoInfo.links[0].type,
//                 postIsDownloadable: true,
//                 postQuality: `${videoInfo.links[0].dimensions.height} x ${videoInfo.links[0].dimensions.width}p`,
//                 postExt: 'mp4',
//             }

//         }
//     } catch (err) {
//         if (!err.status)
//             throw createError(500, 'Internal Server Error', err);
//         else
//             throw err;
//     }
// }

// function formatDuration(duration) {
//     try {
//         if (!duration)
//             throw createError(404, 'Duration not found');
//         const ms = duration * 1000;
//         const seconds = Math.floor((ms / 1000) % 60);
//         const minutes = Math.floor((ms / (1000 * 60)) % 60);
//         const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
//         return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//     } catch (err) {
//         if (!err.status)
//             throw createError(500, 'Internal Server Error');
//     }
// }

// module.exports = handleInstaVideoFormats;