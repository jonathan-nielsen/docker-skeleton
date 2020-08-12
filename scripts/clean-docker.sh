#!/bin/bash

# Remove all containers
docker stop $(docker ps -a -q)
docker rm -f $(docker ps -a -q)

# Remove all images
docker rmi -f $(docker images -a -q)

# Remove all volumes
docker volume prune -f