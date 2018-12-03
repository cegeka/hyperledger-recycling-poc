
@echo off
SET DOCKER_FILE=

IF "%1"=="production" (
	@echo Production deployment
	SET DOCKER_FILE=-f docker-compose-prod.yaml
) else (
	@echo Development deployment
)
@echo on

REM Need to inject these into the docker-compose file (and subsequent HL fabric docker-compose) to allow linux-style paths to work on windows
REM make sure we delete any existing environment variables
REM Due to a bug in docker-compose for windows, the process can't use the environment variables in the current session
REM However we can place them in an .env file which will be automatically loaded
del /Q .env
@echo off
@echo COMPOSE_CONVERT_WINDOWS_PATHS=1 > .env
@echo COMPOSE_FORCE_WINDOWS_HOST=1 >> .env
@echo PWD=%cd% >> .env

@echo on

REM make sure everything is down
docker-compose %DOCKER_FILE% down

REM remove the old application state (mostly for the monitor database)
del /S /Q .data

REM prepare the explorer build by copying the fabric certificates
del /S /Q -rf explorer\crypto-config
robocopy /E fabric-orchestrator\fabric-tools\fabric-scripts\hlfv11\composer\crypto-config explorer\crypto-config

REM only after the above files are copied can we build the containers!
docker-compose %DOCKER_FILE% build 

REM create the backend container and run the deploy script only!
docker-compose %DOCKER_FILE% up -d orchestrator

REM a guess of how long it takes. We can't really make sure the peer servers have started & joined the network
timeout /t 20 /NOBREAK

docker-compose %DOCKER_FILE% up --no-start backend
docker-compose %DOCKER_FILE% run backend ./deploy.sh

REM start the backend & import data
REM add-data.bat 
docker-compose %DOCKER_FILE% up -d backend
timeout /t 5 /NOBREAK
docker exec -it hyper-backend npm run setup


REM initialize the explorer database
docker-compose %DOCKER_FILE% up -d explorer-db
docker-compose %DOCKER_FILE% up --no-start explorer
docker-compose %DOCKER_FILE% run explorer ./initDb.sh

REM Start everything
docker-compose %DOCKER_FILE% up -d

