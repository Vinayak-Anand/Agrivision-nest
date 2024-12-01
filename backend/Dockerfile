FROM node:22-alpine
WORKDIR /usr/src/app/backend
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD node dist/server.js