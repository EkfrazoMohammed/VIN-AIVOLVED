FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
npm install --ignore-scripts

# Copy the rest of the application code
COPY . .

EXPOSE 3010

CMD ["npm","start"]