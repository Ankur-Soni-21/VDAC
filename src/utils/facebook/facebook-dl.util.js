const axios = require("axios"); // Import the axios library for making HTTP requests


// Function to download Facebook video
function facebookdl(videoUrl) {
    return new Promise((resolve, reject) => {
        // Define headers for the HTTP request 
        const headers = {
            "sec-fetch-user": "?1",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-site": "none",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "cache-control": "max-age=0",
            'authority': "www.facebook.com",
            "upgrade-insecure-requests": "1",
            "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
            "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
            'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            'cookie': "sb=Rn8BYQvCEb2fpMQZjsd6L382; datr=Rn8BYbyhXgw9RlOvmsosmVNT; c_user=100003164630629; _fbp=fb.1.1629876126997.444699739; wd=1920x939; spin=r.1004812505_b.trunk_t.1638730393_s.1_v.2_; xs=28%3A8ROnP0aeVF8XcQ%3A2%3A1627488145%3A-1%3A4916%3A%3AAcWIuSjPy2mlTPuZAeA2wWzHzEDuumXI89jH8a_QIV8; fr=0jQw7hcrFdas2ZeyT.AWVpRNl_4noCEs_hb8kaZahs-jA.BhrQqa.3E.AAA.0.0.BhrQqa.AWUu879ZtCw",
        }

        // Helper function to parse strings safely
        const parseString = (string) => JSON.parse(`{"text": "${string}"}`).text;

        // Extract video ID from the URL using regex
        const videoIdMatch = videoUrl.match(/videos\/(\d+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : "unknown";

        // Validate the video URL
        if (!videoUrl || !videoUrl.trim()) return reject("Please specify the Facebook URL");
        if (["facebook.com", "fb.watch"].every((domain) => !videoUrl.includes(domain))) return reject("Please enter the valid Facebook URL");

        // Make a GET request to the video URL with the defined headers
        axios.get(videoUrl, { headers }).then(({ data }) => {
            // Replace HTML entities with their actual characters
            data = data.replace(/&quot;/g, '"').replace(/&amp;/g, "&");

            // Extract video URLs and metadata using regex
            const sdMatch = data.match(/"browser_native_sd_url":"(.*?)"/) || data.match(/"playable_url":"(.*?)"/) || data.match(/sd_src\s*:\s*"([^"]*)"/) || data.match(/(?<="src":")[^"]*(https:\/\/[^"]*)/);
            const hdMatch = data.match(/"browser_native_hd_url":"(.*?)"/) || data.match(/"playable_url_quality_hd":"(.*?)"/) || data.match(/hd_src\s*:\s*"([^"]*)"/);
            const titleMatch = data.match(/<meta\s+name="description"\s+content="([^"]+)"/);
            const thumbMatch = data.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);
            var duration = data.match(/"playable_duration_in_ms":[0-9]+/gm);

            // If SD video URL is found, construct the response object
            if (sdMatch && sdMatch[1]) {
                const res = {
                    meta: {
                        title: titleMatch[1].replace(/\n/g, '').replace(/'\s*\+\s*'/g, ''), // Clean up the title
                        source: videoUrl,
                        duration: formatDuration(duration) // Format the duration
                    },
                    thumb: thumbMatch && thumbMatch[1] ? parseString(thumbMatch[1]) : "", // Parse thumbnail URL
                    video_quality: [
                        sdMatch[1] ? "SD" : null,
                        hdMatch[1] ? "HD" : null
                    ],
                    url: [
                        {
                            url: parseString(sdMatch[1]), // Parse SD video URL
                            type: "mp4",
                            ext: "mp4",
                            downloadable: true,
                            quality: "SD",
                            audio: true,
                        },
                        {
                            url: hdMatch && hdMatch[1] ? parseString(hdMatch[1]) : "", // Parse HD video URL if available
                            type: "mp4",
                            ext: "mp4",
                            downloadable: true,
                            quality: "HD",
                            audio: true,
                        },
                    ]
                }
                resolve(res) // Resolve the promise with the response object
            } else {
                reject(`ERROR: [Facebook] ${videoId}: Unable to fetch video information for URL: ${videoUrl}`) // Reject if no video URL found
            }

        }).catch((err) => {
            // Handle errors during the HTTP request
            reject(`ERROR: [Facebook] ${videoId}: Unable to fetch video information for URL: ${videoUrl} `)
        })
    })
}

// Function to format the video duration from milliseconds to HH:MM:SS
function formatDuration(duration) {
    try {
        if (!duration)
            throw createError(404, 'Duration not found'); // Throw error if duration is not found
        duration = Number(duration[0].split(":")[1]) / 1000; // Convert duration from milliseconds to seconds
        const hours = Math.floor(duration / 3600); // Calculate hours
        const minutes = Math.floor((duration % 3600) / 60); // Calculate minutes
        const seconds = Math.floor(duration % 60); // Calculate seconds

        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // Format duration as HH:MM:SS
    } catch (err) {
        if (!err.status)
            throw createError(500, 'Internal Server Error'); // Throw internal server error if any other error occurs
    }
}

// Export the facebookdl function as a module
module.exports = facebookdl;