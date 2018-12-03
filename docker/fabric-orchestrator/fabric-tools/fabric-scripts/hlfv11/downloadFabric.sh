#!/bin/bash

# Exit on first error, print all commands.
set -e

# Set ARCH
ARCH=`uname -m`
VERSION=${HL_FABRIC_TAG:=1.1.0}

# Grab the current directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "checking for version ${VERSION}"

# Pull and tag the latest Hyperledger Fabric base image.
docker pull hyperledger/fabric-peer:$ARCH-$VERSION
docker pull hyperledger/fabric-ca:$ARCH-$VERSION
docker pull hyperledger/fabric-ccenv:$ARCH-$VERSION
docker pull hyperledger/fabric-orderer:$ARCH-$VERSION
docker pull hyperledger/fabric-couchdb:$ARCH-0.4.6
