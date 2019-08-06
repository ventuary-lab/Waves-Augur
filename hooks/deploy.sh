#!/bin/bash

cd ../..
docker-compose build --pull && docker-compose up --build --remove-orphans -d
