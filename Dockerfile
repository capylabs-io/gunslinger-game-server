FROM node:alpine AS node-builder

WORKDIR /backend

COPY package*.json ./
RUN npm install
COPY tsconfig.json .
# COPY babel.config.json .
COPY src/ ./src/
RUN npx tsc

FROM registry.heroiclabs.com/heroiclabs/nakama:3.15.0

COPY --from=node-builder /backend/build/*.js /nakama/data/modules/build/
COPY local.yml /nakama/data

EXPOSE 7349
EXPOSE 7350
EXPOSE 7351

CMD /bin/sh -ecx exec /nakama/nakama --config /nakama/data/local.yml
