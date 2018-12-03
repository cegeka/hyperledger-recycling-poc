# Customizations on top of the official Hyperledger composer development dockers

This repository is forked from the official Hyperledger composer tools repository.
It brings the following changes:

## Configurable docker image tag for v11 fabric

A new environment variable `HL_FABRIC_TAG` is introduced that will dictate what specific tag of the Hyperledger image will be used when running with `HL_FABRIC_VERSION=hlfv11`. This defaults to the 1.1.0 version.
The variable will not affect the couchDb image version used, which remains fixed to 0.4.6.

## Force docker containers to run in a pre-existing composer network

This is done to allow the Fabric docker containers to join an existing docker-composer network that is running the backend services.
The name of the external composer network is set via the `EXTERNAL_NETWORK_NAME` environment variable
