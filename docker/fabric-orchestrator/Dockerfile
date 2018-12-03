FROM ubuntu:latest

ARG HL_FABRIC_VERSION
ARG HL_FABRIC_TAG
ARG EXTERNAL_NETWORK_NAME
ARG HL_FABRIC_DEVMODE
ARG HL_FILES_ROOT_PATH
ARG FORCE_REBUILD_CHAINCODE_CONTAINER

RUN apt-get update && apt-get install -y \
    curl \
    tar

#RUN curl -fsSL get.docker.com -o get-docker.sh
#RUN sh get-docker.sh

# Code taken from here - https://stackoverflow.com/questions/38675925/is-it-possible-to-install-only-the-docker-cli-and-not-the-daemon

ENV DOCKERVERSION=18.03.0-ce
RUN curl -fsSLO https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKERVERSION}.tgz \
  && mv docker-${DOCKERVERSION}.tgz docker.tgz \
  && tar xzvf docker.tgz \
  && mv docker/docker /usr/local/bin \
  && rm -r docker docker.tgz

RUN curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/bin/docker-compose
RUN chmod +x /usr/bin/docker-compose

# when developing this container locally, can be replaced with COPY ./fabric-dev-servers ./fabric-tools
RUN curl -O https://raw.githubusercontent.com/cegeka/hyperledger-composer-tools/master/packages/fabric-orchestrator/download-fabric-tools.sh \
  && chmod +x ./download-fabric-tools.sh \
  && ./download-fabric-tools.sh

WORKDIR ./fabric-tools

COPY ./entrypoint.sh .
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]