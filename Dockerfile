FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3010

CMD ["npm","start"]