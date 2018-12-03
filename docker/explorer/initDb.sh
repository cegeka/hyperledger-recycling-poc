#!/bin/bash

./wait-for-it.sh -t 30 ${DB_HOST}:3306 -- echo "Database ready"

# extra-safe, wait some more
sleep 10

# run the init script
mysql -u ${DB_USER} --host ${DB_HOST} --password=${DB_PASSWORD} --database fabricexplorer < ./db/fabricexplorer.sql
