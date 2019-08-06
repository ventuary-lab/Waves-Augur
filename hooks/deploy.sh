#!/bin/bash

cd /src
git reset --hard
git pull
docker-compose up -d --no-deps --build app
