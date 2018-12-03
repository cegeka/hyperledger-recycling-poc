FROM node:8-jessie

RUN apt-get update && apt-get install -y mysql-client gettext-base && apt-get clean

# Latest code contains breaking changes, so use a specific revision instead
#RUN git clone --single-branch -b master --depth 1 https://github.com/hyperledger/blockchain-explorer
RUN git clone https://github.com/hyperledger/blockchain-explorer
WORKDIR /blockchain-explorer
RUN git checkout 7255942e7cad0c829d6189a54920c168e83fd1a6 && git reset --hard
RUN npm install

# copy & overwrite everything - local scripts, crypt-config folder, config.json
COPY . .

# No longer required, since file is copied above
# COPY config.json /blockchain-explorer/config.json

CMD /bin/sh -c "envsubst '\$DB_USER \$DB_PASSWORD \$DB_HOST' < /blockchain-explorer/config.json.env > /blockchain-explorer/config.json && node main.js"
