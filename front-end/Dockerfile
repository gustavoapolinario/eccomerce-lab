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

RUN mkdir /app

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ /app

WORKDIR /app
