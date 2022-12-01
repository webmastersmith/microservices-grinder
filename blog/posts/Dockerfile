FROM alpine
RUN apk add --update nodejs npm
# RUN node -v
# RUN npm -v
# if this folder does not exist, will be created automatically.
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY ./server.ts tsconfig.json types.ts ./
# CMD ["node", "index.js"]
CMD ["npm", "run", "dev"]
