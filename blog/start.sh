#!/bin/bash
cd ./client
docker run --rm --name client -dp5173:5173 $(docker build -q .)
cd ../event-bus
docker run --rm --env-file=.env -dp4005:4005 --name event-bus $(docker build -q .)
cd ../posts
docker run --rm --env-file=.env -dp4000:4000 --name post $(docker build -q .)
cd ../comments
docker run --rm --env-file=.env -dp4001:4001 --name comment $(docker build -q .)
cd ../query
docker run --rm --env-file=.env -dp4002:4002 --name query $(docker build -q .)
cd ../moderation
docker run --rm --env-file=.env -dp4003:4003 --name moderation $(docker build -q .)
cd ../