FROM nginx:latest

ARG MAIN_APP_URL

USER root

WORKDIR /opt/frontend

# Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

#RUN mkdir -p /etc/nginx/logs/

# continue with normal install of latest sources
COPY . .

# Replace the production configuration values with the build-time args BEFORE building everyting
RUN envsubst '\$MAIN_APP_URL' < /opt/frontend/index.html > /opt/frontend/index.html

#CMD /bin/bash -c "nginx -g 'daemon off;'"
