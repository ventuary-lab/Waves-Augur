# !/env/bash

bash spa-utils.sh
docker build -t ventuary .
docker run -itd --name ventuary --restart always -p 5000:5000 ventuary