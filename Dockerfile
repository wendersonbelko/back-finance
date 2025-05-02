# syntax=docker/dockerfile:1
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install

COPY . .
# compila TypeScript sem depender de script no package.json
RUN npx tsc --project tsconfig.json

FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# copia saída compilada
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]