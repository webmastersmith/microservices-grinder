FROM alpine
RUN apk add --update nodejs npm
ARG PORT
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
WORKDIR /app
COPY ./package.json ./
RUN npm i
# COPY ./tsconfig.json types.ts ./
COPY build build
EXPOSE 4000
CMD ["node", "build/server.js"]
