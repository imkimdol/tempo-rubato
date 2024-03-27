FROM node:18

WORKDIR /bot

RUN apt-get update
RUN apt install -y ffmpeg
RUN yarn global add pm2

COPY package.json ./
COPY yarn.lock ./
RUN yarn install
RUN yarn add sharp --ignore-engines

COPY .env ./
COPY ./src ./src
RUN yarn run compile
RUN yarn run deploy all

CMD yarn run start-runtime