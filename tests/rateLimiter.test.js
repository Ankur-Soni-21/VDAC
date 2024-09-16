const axios = require('axios');

const testRateLimiter = async () => {
    const url = 'http://localhost:5000/api/v1/video/video-info';
    const data = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    };

    for (let i = 0; i < 110; i++) { // Adjust the number of requests as needed
        try {
            const response = await axios.post(url, data);
            console.log(`Request ${i + 1}:`, response.status);
        } catch (error) {
            if (error.response) {
                console.log(`Request ${i + 1}:`, error.response.status, error.response.data);
            } else {
                console.log(`Request ${i + 1}:`, error.message);
            }
        }
    }
};

testRateLimiter();