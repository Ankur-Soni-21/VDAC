FROM node

COPY src /app/src
COPY package.json /app/package.json 
COPY package-lock.json /app/package-lock.json

RUN cd /app && npm install

ENTRYPOINT [ "node", "/app/src/index.js" ]