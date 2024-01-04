FROM node:21

WORKDIR /usr/src/app

COPY build .
COPY package*.json ./
COPY db ./db

RUN npm install

ENV NODE_ENV=production

EXPOSE 3000
CMD [ "npm", "start" ]