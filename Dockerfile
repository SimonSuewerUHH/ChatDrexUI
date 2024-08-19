FROM node:20-alpine3.20 as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:20-alpine3.20

RUN npm install -g http-server

ENV NITRO_PORT=80

WORKDIR /app

COPY --from=builder /app/dist/ .

EXPOSE 8080

CMD [ "http-server", "/app" ]