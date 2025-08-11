
FROM --platform=linux/amd64 node:24-alpine

RUN apk update && apk upgrade && apk add openssl

WORKDIR /pinpin

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js"]