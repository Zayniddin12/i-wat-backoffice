FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /app

COPY . .

RUN yarn && yarn build

EXPOSE 8080
CMD [ "http-server", "dist" ]
