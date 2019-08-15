FROM node:12-alpine

RUN apk add python python-dev py-pip vips-dev fftw-dev build-base --update \
    --repository https://alpine.global.ssl.fastly.net/alpine/edge/community/

RUN apk add --update nodejs yarn tzdata
ENV TZ Europe/Moscow

RUN npm i forever -g

COPY package.json yarn.lock /app/
WORKDIR /app
RUN yarn

COPY node /app/node
COPY src /app/src
COPY webpack.js /app
COPY server.js /app
# RUN touch .env >
RUN touch .environment
RUN echo -e 'DAPP=$DAPP\nAPP_DAPP_NETWORK=$APP_DAPP_NETWORK' >> .environment

RUN npm run heroku-postbuild
ENTRYPOINT ["forever", "/app/server.js"]