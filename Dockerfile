FROM node:20-alpine

WORKDIR /app

COPY package.json .

COPY . . 

EXPOSE 3010

CMD ["npm","start"]
