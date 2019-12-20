FROM node:12-stretch-slim

# RUN apk add vips-dev fftw-dev build-base --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/main/ --repository https://dl-3.alpinelinux.org/alpine/edge/testing

# RUN apk add --update nodejs yarn tzdata
ENV TZ Europe/Moscow

COPY package.json yarn.lock server-wrap.sh /app/
WORKDIR /app
RUN yarn

COPY node /app/node
COPY src /app/src
COPY landing /app/landing
COPY webpack.js /app
COPY add-gtag.js /app
RUN node webpack production

COPY server.js /app
COPY aws-upload.js /app

ENTRYPOINT [ "bash", "server-wrap.sh", "--command", "serve", "--timeout", "1h" ]