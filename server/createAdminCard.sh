#!/bin/bash

./fabric-tools/createPeerAdminCard.sh

# replace the generated connection.json file with our docker-aware version
cp docker-fabric-connection.json ~/.composer/cards/PeerAdmin\@hlfv1/connection.json
