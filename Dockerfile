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

ENTRYPOINT ["/bin/sh", "-ecx", "/nakama/nakama migrate up --database.address postgres:GybxJha5w5GR3nUU@database-dev-gunslinger-nakama.cs17mgilcjdt.us-east-1.rds.amazonaws.com:5432/postgres && exec /nakama/nakama --config /nakama/data/local.yml"]
