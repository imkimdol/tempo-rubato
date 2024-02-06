FROM node:18

WORKDIR /bot

COPY package.json ./
COPY yarn.lock ./
COPY .env ./
COPY ./src ./src

RUN apt-get update

RUN yarn global add pm2
RUN yarn install
RUN yarn run deploy

CMD yarn run start-runtime