#!/bin/bash

cd /src
git reset --hard
git pull
chmod +x .
docker stop ventuary-dao-app
docker rm ventuary-dao-app
docker-compose up -d --no-deps --build app
