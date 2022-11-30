FROM alpine
RUN apk add --update nodejs npm
WORKDIR /app
ENV NODE_ENV=production
COPY . .
RUN npm i

# CMD ["node", "index.js"]
CMD ["npm", "run", "dev"]