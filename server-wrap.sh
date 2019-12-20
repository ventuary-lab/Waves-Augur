# !/bin/bash

# Globals
args=?;
command=?; # - run script from package.json. Only command or script_name should be provided but not both
script_name=?;
restart_timeout=14400 # in seconds
current_pid=?;

function run_with_restarts {
    if [ $command != "?" ]
    then
        npm run $command &
        current_pid=$!;
        echo "PID is $current_pid"
    elif [ $script_name != "?" ]
    then
        $("node $script_name $args")
    fi

    echo "Restart timeout cycle is $restart_timeout seconds"

    sleep $restart_timeout;

    kill -9 $current_pid;

    echo 'Restart app in 10 seconds...'

    sleep 10;

    run_with_restarts $@;
}

function parse_time {
    local tm=$1;
    local amount=$(echo $tm | sed 's/[^0-9]//');
    local unit=$(echo $tm | awk '{ split($0,a,""); print a[length(a)] }');
    local res=3600;

    case "$unit" in
        m) res=$(echo "60 * $amount" | bc) ;;
        h) res=$(echo "60 * 60 * $amount" | bc) ;;
        s) res=$amount ;;
    esac

    echo $res;
}

function main {
    args=$@;

    while [ -n "$1" ]
    do
        case "$1" in
            --script) script_name=$2 ;;
            --timeout) restart_timeout=$(parse_time $2) ;;
            --command) command=$2 ;;
        esac
        shift
    done

    run_with_restarts $script_name;
}

main $@