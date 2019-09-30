# !/usr/bin/bash

filename=$1
random_decimal=$(node -e 'console.log(Math.random())');

echo -n "
FOR_HMAC_SECRET_KEY=$random_decimal
" > "$1"