FROM nginx:latest

ARG FRONTEND_ENV
ARG PUBLIC_URL
ARG MONITOR_PUBLIC_URL

USER root

# prerequisites & NodeJS
RUN apt-get update && apt-get install -y build-essential curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# node_gyp build fails with permission errors unless runnning with --unsafe-perm
RUN npm install -g --unsafe-perm @angular/cli

WORKDIR /opt/frontend

#build speed improvement. Not used now
#COPY package-base.json package.json
#RUN npm install

# Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf.env

RUN rm -f /etc/nginx/nginx.conf
RUN mkdir -p /etc/nginx/logs/

# Not sure why but sometimes the build fails because of a missing uglify-es
RUN npm install uglify-es

# continue with normal install of latest sources
COPY . .

RUN npm install

# Replace the production configuration values with the build-time args BEFORE building everyting
RUN envsubst '\$PUBLIC_URL \$MONITOR_PUBLIC_URL' < /opt/frontend/src/environments/environment.prod-template.ts > /opt/frontend/src/environments/environment.prod.ts

RUN ng build $FRONTEND_ENV

CMD /bin/bash -c "envsubst '\$SERVER_HOST \$SERVER_PORT' < /etc/nginx/nginx.conf.env > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
