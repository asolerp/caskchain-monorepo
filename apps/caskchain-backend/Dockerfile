FROM node:18-alpine AS base
RUN apk add git
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn dev:build
EXPOSE 4000
CMD ["node", "build/index.js"]