# TINY TOOLS API

## Overview
TINY TOOLS API is a collection of small, useful tools designed to simplify everyday tasks. This API provides a variety of endpoints to perform different operations efficiently.

## Features
- **YouTube Video Downloader**: Download videos from YouTube with ease.
- **Instagram Video Downloader**: Save videos from Instagram directly to your device.
- **Twitter Video Downloader**: Download videos from Twitter effortlessly.
- **Facebook Video Downloader**: Easily download videos from Facebook.
- **YouTube Transcript Generator/Downloader**: Generate and download transcripts for YouTube videos.

## Installation
To install the TINY TOOLS API, clone the repository and install the dependencies:
```bash
git clone https://github.com/yourusername/tiny-tools-api.git
cd tiny-tools-api
npm install
```


## Environment Variables
Create a `.env` file in the root directory of your project. You can use the provided `env.sample` file as a template:
```bash
cp env.sample .env
```
Make sure to fill in the necessary environment variables in the `.env` file.

## Docker Setup and usage
To use Docker, build the Docker image and start the containers using Docker Compose:
```bash
docker build -t tiny_tools .
docker-compose up
```
Access the API at `http://localhost:5000/api/health`.


## Endpoints
- `POST /api/v1/video/yt`: Download videos from YouTube.
- `POST /api/v1/video/insta`: Save videos from Instagram.
- `POST /api/v1/video/x`: Download videos from Twitter.
- `POST /api/v1/video/fb`: Download videos from Facebook.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any questions or suggestions, please contact an2112soni@gmail.com.
