FROM node:14-alpine

WORKDIR /code

ADD . /code
RUN ls -lah

RUN yarn

EXPOSE 3000

CMD npm start