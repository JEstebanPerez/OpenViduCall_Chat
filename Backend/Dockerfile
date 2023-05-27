
FROM node:16-alpine as build-step

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/backend

WORKDIR /usr/src/app/backend

COPY package*.json ./

RUN npm install --save --force

COPY . .

EXPOSE 3000
EXPOSE 5000

CMD npm run start