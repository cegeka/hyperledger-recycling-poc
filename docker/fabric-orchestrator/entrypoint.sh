#!/bin/bash
echo "started"

IS_DEVMODE=${HL_FABRIC_DEVMODE:="false"}

echo "Running with HL_FABRIC_VERSION ${HL_FABRIC_VERSION}"
echo "  Container version ${HL_FABRIC_TAG}"
echo "  Devmode ${IS_DEVMODE}"
echo "  Docker composer network name ${EXTERNAL_NETWORK_NAME}"
echo "  Local host fabric resource path ${HL_FILES_ROOT_PATH}"


if [ "${FORCE_REBUILD_CHAINCODE_CONTAINER}" == "true" ]; then
  # make sure this is identical to the package name in server/package.json
  PROJECT_NAME=hyperpoc
  echo "cleaning up any old containers with name ${PROJECT_NAME}"
  docker ps -a | grep dev-peer0.org1.example.com-${PROJECT_NAME} | awk '{print $1}' | xargs docker rm
  docker images -a | grep dev-peer0.org1.example.com-${PROJECT_NAME} | awk '{print $1}' | xargs docker rmi
fi

if [ "${IS_DEVMODE}" == "true" ]; then
    START_FABRIC_SCRIPT_PARAMS=--dev
fi

./downloadFabric.sh && ./startFabric.sh ${START_FABRIC_SCRIPT_PARAMS}

function gracefulShutdown {
  echo "Shutting down!"
  # reset network name so we can teardown Fabric even if the orchestrator container is still up
  EXTERNAL_NETWORK_NAME=composer_default ./teardownFabric.sh
}
trap gracefulShutdown SIGTERM

exec "$@" &
while true
do
  tail -f /dev/null & wait
done
