FROM node:19.2-alpine
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
RUN npm run build
EXPOSE 4000
CMD [ "node", "build/index.js" ]