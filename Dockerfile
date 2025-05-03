# syntax=docker/dockerfile:1

####################################################
# Builder Stage: install deps, generate Prisma, compile
####################################################
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
RUN npx tsc --project tsconfig.json --skipLibCheck

####################################################
# Runner Stage: install prod deps and copy artifacts
####################################################
FROM node:18-alpine AS runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
