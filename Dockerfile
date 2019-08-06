FROM node:12-alpine

RUN apk add python python-dev py-pip vips-dev fftw-dev build-base --update-cache \
    --repository https://alpine.global.ssl.fastly.net/alpine/edge/community/ \
    --repository https://alpine.global.ssl.fastly.net/alpine/edge/main

RUN apk add --update nodejs yarn tzdata
ENV TZ Europe/Moscow

RUN npm i forever -g

COPY package.json yarn.lock /app/
WORKDIR /app
RUN yarn

COPY node /app/node
COPY src /app/src
COPY webpack.js /app
RUN node webpack production

COPY server.js /app

ENTRYPOINT ["forever", "/app/server.js"]
