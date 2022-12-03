FROM alpine
RUN apk add --update nodejs npm
# RUN node -v
# RUN npm -v
# if this folder does not exist, will be created automatically.
ARG PORT
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
WORKDIR /app
COPY ./package.json ./
RUN npm i --omit=dev
# COPY ./server.ts tsconfig.json types.ts ./
COPY build build
# CMD ["node", "index.js"]
CMD ["node", "build/server.js"]
