FROM node as build

RUN mkdir /app
WORKDIR /app

COPY package*.json /app/
RUN npm ci

COPY . /app/
RUN npm run build

FROM nginx as final

RUN apt-get update && apt-get upgrade -y \
    && apt-get clean

RUN groupadd -g 1001 appuser && useradd -u 1001 -g appuser -s /bin/sh -m appuser

RUN mkdir /app && chown -R appuser:appuser /app

RUN mkdir -p /app /var/run/nginx /var/log/nginx /var/cache/nginx/ \
    && chown -R appuser:appuser /app /var/run/nginx /var/log/nginx /var/cache/nginx/

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ /app

RUN chown -R appuser:appuser /app

USER 1001

WORKDIR /app
