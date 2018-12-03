#!/bin/bash

#
# Script needs to be run as sudo so the removal of old data works!
#

# If we ever ran the windows version of the scripts, make sure there are no leftover environment variables
rm .env

if [[ $1 == 'production' ]]; then
	echo "Production deployment"
    COMPOSER_FILE='-f docker-compose-prod.yaml'
else
    echo "Development deployment"
fi

# make sure everything is down
docker-compose $COMPOSER_FILE down

#remove the old application state (mostly for the monitor database)
rm -rf .data

# prepare the explorer build by copying the fabric certificates
rm -rf explorer/crypto-config
cp -r ./fabric-orchestrator/fabric-tools/fabric-scripts/hlfv11/composer/crypto-config explorer/crypto-config

# only after the above files are copied can we build the containers!
docker-compose $COMPOSER_FILE build

# create the backend container and run the deploy script only!
docker-compose $COMPOSER_FILE up -d orchestrator
# a guess of how long it takes. We can't really make sure the peer servers have started & joined the network
sleep 20

docker-compose $COMPOSER_FILE up --no-start backend
docker-compose $COMPOSER_FILE run backend ./deploy.sh

# start the backend & import data
./add-data.sh "$COMPOSER_FILE"

# initialize the explorer database
docker-compose $COMPOSER_FILE up -d explorer-db
docker-compose $COMPOSER_FILE up --no-start explorer
docker-compose $COMPOSER_FILE run explorer ./initDb.sh

# Start everything
docker-compose $COMPOSER_FILE up -d
