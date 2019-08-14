# !/env/bash

cat .env
ls -la

docker build -t ventuary .
docker run --env-file=.env -itd --name ventuary --restart always -v ~/dev/ventuary:/data -p 5000:5000 ventuary
