const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const generateSignature = (url, ts) => {
    const data = url + ts + secret;
    const hash = crypto.createHash('md5')
        .update(data)
        .digest('hex');
    return hash;
}

rl.question('Enter the YouTube URL: ', (url) => {
    rl.question('Enter 1 for current timestamp or 2 for a 10-minute old timestamp: ', (choice) => {
        let timestamp;
        if (choice === '1') {
            timestamp = Math.floor(Date.now() / 1000);
        } else if (choice === '2') {
            timestamp = Math.floor((Date.now() - 600000) / 1000);
        } else {
            console.log('Invalid choice!');
            rl.close();
            return;
        }

        // Your code logic here using the YouTube URL and timestamp
        const SECRET_KEY = process.env.SECRET_KEY;
        const data = url + timestamp + SECRET_KEY;
        const signature = crypto.createHash('md5')
            .update(data)
            .digest('hex');

        console.log('Signature:', signature);
        console.log('Timestamp:', timestamp);
        
        rl.close();
    });
});