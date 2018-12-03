# Setting up a demo Production environment

## Configure server address

In the docker folder, make sure to update the MAIN_APP_URL, PUBLIC_URL & MONITOR_PUBLIC_URL variables in the `docker-compose.yaml` file to point to the publicly visible URL of the webserver. Anytime these 2 variables are changed, the frontend docker needs to be rebuilt (`docker-compose -f docker-compose-prod.yaml build frontend landing`) and restarted (`docker-compose -f docker-compose-prod.yaml stop frontend landing && docker-compose -f docker-compose-prod.yaml up -d frontend landing`).

An additional nginx can be installed locally to enable HTTPs communication on top of the http stream. If this is done, the environment variables above need to be updated to use https URLs as well.

## Composer setup

The docker-composer project contains all the components required to run the demo application: frontend + backend application, landing page with general project information, blockchain monitoring server + database and an orchestrator container that is reponsible to start the Hyperledger Fabric servers.

### Orchestrator

The orchestrator container uses Docker-in-Docker by mapping the host Docker socker within the orchestrator to be able to start the Fabric containers on the host. It's purpose is to wrap the scripts that are used to start/stop the Fabric servers that are part of the official hyperledger-composer-tools package. We use an adapted version of this package (https://github.com/cegeka/hyperledger-composer-tools/tree/master/packages/fabric-dev-servers) that allows the inner, Fabric docker-composer network to be joined to the docker-composer network of the parent orchestrator container.
This container is configurable via environment parameters, that can specify which version of Hyperledger Fabric we're targeting:

- `HL_FABRIC_VERSION` has to be set to `hlfv11`. Versions hlv1 (before fabric 1.1.0) are not supported by the template
- `HL_FABRIC_TAG` has to be set to a version of at least `1.1.0` (default). This will affect what specific Fabric docker containers are used when starting the hyperledger network
- `EXTERNAL_NETWORK_NAME` has to be set to the name of the docker-compose network in which the orchestrator (and the application backend) will be running
- `FORCE_REBUILD_CHAINCODE_CONTAINER` has to be set to `true` to force the re-creation of the chaincode container. Setting this to false will make the Hyperledger composer network deployments faster, but the composer code will not be recompiled unless the `server\package.json` version is incremented. No error/warning is shown if the version is not incremented and the old code will be used instead.

Known issues:

- the teardownFabric.sh script no longer works because the network in which the inner Fabric composer is running is external. All  Hyperleder Fabric container will be stopped, but not destroyed.
- composer-cli version is hardcoded in 2 places: backend service Docker file (when installed globally) and backend package.json
- the redeploy script does not work without manually increasing the package.json version number. This also requires rebuilding the backend, so it's easier to just teardown the whole docker composer project and re-deploy with the updated code
- [MacOs only] downloadFabric.sh may hang if the images are not already downloaded on the host machine.

## Setup and start project

The following script has to be ran every time the backend/chaincode code is changed. It will take care of rebuilding the hyperledger composer backend, start the Fabric network, install the composer application and initialize the sample data.

Deployment is automated via a series of docker-compose containers. Run the following command in the `docker` folder, depending on your operating system:

* Linux
```bash
sudo ./composer-setup.sh production
```
(sudo is required to allow deletion of the existing composer volume data)


* MacOs
```bash
./composer-setup.sh production
```

* Windows
```shell
composer-setup.bat production
```

Once the script is finished, the application will be left running and ready to be used.


### Frontend-only update

If the frontend is the only updated application, there's no need to restart the entire Fabric network. The frontend container can be rebuit independently:

1. Rebuild the new frontend container

```bash
docker-compose -f docker-composer-prod.yaml build --no-cache frontend
```

2. Stop and remove the current frontend container

```bash
docker-compose -f docker-composer-prod.yaml stop frontend
docker-compose -f docker-composer-prod.yaml rm frontend
```

3. Start the new container

```bash
docker-compose -f docker-composer-prod.yaml up -d
```

## HTTPS connections

An Nginx proxy should be installed on the local machine to wrap the http port exposed by the docker compose into https.

## Exposed webservice

The main VM NginX Docker setup exposes the following services:

* landing page = `<root URL>:80`
* main website = `<root URL>:8080`
* api = `<root URL>:8080/api/`
* Api explorer = `<root URL>:8080/explorer/` (including trailing slash!)
* Hyperledger monitor = `<root URL>:8081`
