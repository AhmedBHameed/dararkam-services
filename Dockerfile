FROM node:12.16.3-slim

WORKDIR /usr/arkam_service/

COPY ./package*.json ./

RUN yarn

COPY ./ .