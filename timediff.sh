# !/bin/bash

function get_time {
    echo $(node -e 'console.log(Date.now())')
}

t0=$(get_time)

bash $1

t1=$(get_time)

echo $((t1 - t0))