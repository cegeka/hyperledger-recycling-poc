FROM node:carbon

USER root

ARG HL_FABRIC_VERSION
ARG HL_FABRIC_TAG

# Hyperledger specific runtime tools
# 29 March 2018 - v0.19.0 of composer-cli does not support the runtime install command
RUN npm install -g --unsafe-perm composer-rest-server@0.19.4 composer-cli@0.19.4

RUN mkdir /src
WORKDIR /src

RUN curl -O https://raw.githubusercontent.com/cegeka/hyperledger-composer-tools/master/packages/fabric-orchestrator/download-fabric-tools.sh \
  && chmod +x ./download-fabric-tools.sh \
  && ./download-fabric-tools.sh

# Not used - Copy a slow-changing version of package.json so the npm install command doesn't have to always start from zero
# COPY package.json package.json
# RUN npm install

# Copy the source code (including newer package.json)
COPY . .
RUN npm install

CMD npm start
