FROM node:16-bullseye-slim as base

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        build-essential \
        python3 && \
    rm -fr /var/lib/apt/lists/* && \
    rm -rf /etc/apt/sources.list.d/*

RUN npm install --global --quiet npm truffle ganache

FROM base as truffle

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

RUN npm install --quiet

COPY truffle-config.js /app
COPY contracts /app/contracts
COPY migrations /app/migrations/
COPY test /app/test/

CMD ["truffle", "version"]

FROM base as ganache

RUN mkdir -p /home
WORKDIR /home
EXPOSE 8545

ENTRYPOINT ["ganache", "-host 0.0.0.0"]