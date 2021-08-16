FROM node:16-alpine

RUN apk update

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src /app/src
COPY public /app/public

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
