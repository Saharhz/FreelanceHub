FROM node:22-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 5001

CMD [ "node", "src/main.js" ]