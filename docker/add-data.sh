#!/bin/bash

docker-compose $1 up -d backend

sleep 5

docker exec -it hyper-backend npm run setup