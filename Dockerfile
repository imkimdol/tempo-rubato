FROM node:18

WORKDIR /bot

RUN apt-get update
RUN apt install -y ffmpeg

COPY package.json ./
COPY yarn.lock ./
RUN yarn global add pm2
RUN yarn install

COPY .env ./
COPY ./src ./src
RUN yarn run deploy

CMD yarn run start-runtime