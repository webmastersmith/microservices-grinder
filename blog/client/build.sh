#!/bin/bash

# . build.sh posts
# check if argument was passed in.
if [[ -n "$1" ]] ; 
  then
    # make sure build folder reflects code changes.
    npm run build
    # add args to build environment.
    export $(grep -v '^$' .env | xargs)
    # image name
    img="${DOCKER_ID}/${1}:latest"
    docker build --build-arg NODE_ENV --build-arg PORT -t $img .
    docker push $img

    kubectl rollout restart deployment ${1}-depl
  else
    echo "Please supply argument :-)"
    exit 1
fi

