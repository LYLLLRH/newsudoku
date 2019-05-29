FROM alpine
RUN apk add --update nodejs nodejs-npm
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
RUN npm install && npm cache clean --force
COPY . /usr/src/app
CMD node app.js
EXPOSE 3000