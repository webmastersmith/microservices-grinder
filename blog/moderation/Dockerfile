FROM node:19.2-alpine
ARG PORT
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . . 
RUN npm run build
EXPOSE 4003
CMD ["node", "build/server.js"]
