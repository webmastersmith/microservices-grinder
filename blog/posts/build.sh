#!/bin/bash

# . build.sh posts
# add args to build environment.
export $(grep -v '^$' .env | xargs)
# image name
img="${DOCKER_ID}/${1}:latest"
docker build --build-arg NODE_ENV --build-arg PORT -t $img .
docker push $img
