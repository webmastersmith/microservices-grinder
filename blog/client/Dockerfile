FROM node:19.2-slim
RUN npm install -g npm@9.1.3
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY node_modules node_modules
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts ./
COPY public public
EXPOSE 5173
COPY src src
CMD ["npm", "run", "dev"]
