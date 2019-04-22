FROM node:10

WORKDIR /app

VOLUME /data

ENV OUTPUT_DIR /data

ADD ./package-lock.json /app/package-lock.json

ADD ./package.json /app/package.json

RUN npm install --unsafe-perm=true

ADD . /app

CMD npm start