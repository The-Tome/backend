FROM node:16

COPY . .

RUN npm ci

EXPOSE 3001

CMD npm start