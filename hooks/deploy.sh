#!/bin/bash

cd /src
git pull
chmod +x .
docker-compose build app
docker stop $DOCKER_APP_CONTAINER_NAME && docker rm $DOCKER_APP_CONTAINER_NAME
docker-compose up -d --no-deps --no-build app
