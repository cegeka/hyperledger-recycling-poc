#!/bin/bash

docker-compose up -d

docker logs -f hyper-backend
