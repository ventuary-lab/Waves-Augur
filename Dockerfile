FROM node:12-alpine

RUN apk add python python-dev py-pip vips-dev fftw-dev build-base --update \
    --repository https://alpine.global.ssl.fastly.net/alpine/edge/community/

RUN apk add --update nodejs yarn tzdata
ENV TZ Europe/Moscow

COPY package.json yarn.lock /app/
WORKDIR /app
RUN yarn

COPY node /app/node
COPY src /app/src
COPY landing /app/landing
COPY webpack.js /app
RUN node webpack production

COPY server.js /app
COPY aws-upload.js /app

ENTRYPOINT ["node", "/app/server.js"]
