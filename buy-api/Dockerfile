FROM node:20

RUN groupadd -g 1001 appuser && useradd -u 1001 -g appuser -s /bin/sh -m appuser

WORKDIR /app

RUN chown -R appuser:appuser /app

USER 1001

COPY package*.json ./
RUN npm ci --omit dev

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
