FROM alpine
RUN apk add --update nodejs npm
ARG PORT
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
WORKDIR /app
COPY ./package.json ./
RUN npm i --omit=dev
COPY build build
EXPOSE 4001
CMD ["node", "build/server.js"]
