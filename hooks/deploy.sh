#!/bin/bash

cd /src
docker-compose build --pull && docker-compose up --build --remove-orphans -d
