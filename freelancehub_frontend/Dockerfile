FROM node:22-alpine AS builder


WORKDIR /app


COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV NEXT_DISABLE_TYPE_CHECKING=true

RUN npm run build -- --no-lint

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]

