FROM node:16-alpine

RUN apk update

WORKDIR /app

COPY . /app

RUN yarn install

CMD [ "yarn", "test-ci" ]
