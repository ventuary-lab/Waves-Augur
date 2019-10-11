# !/usr/bin/bash

function add_gtag {

}


function main {
    echo $@

    while [ -n "$1" ]
    do
        case x in
            --add-gtag) add_gtag $2; break; ;;
        esac
    done
}

main $@