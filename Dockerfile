# syntax=docker/dockerfile:1

####################################################
# Builder Stage: install deps, generate Prisma, compile
####################################################
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar package e TS config
COPY package.json package-lock.json tsconfig.json ./
RUN npm install

# Copiar esquema Prisma e gerar client
COPY prisma ./prisma
RUN npx prisma generate

# Copiar código fonte segundo rootDir
COPY src ./src

# Compilar TypeScript para JS, ignorando checagem de libs (skipLibCheck)
RUN npx tsc --project tsconfig.json --skipLibCheck

####################################################
# Runner Stage: instalar prod deps e copiar artefatos
####################################################
FROM node:18-alpine AS runner
WORKDIR /app

# Instalar apenas dependências de produção
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copiar Prisma runtime e client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Copiar saída compilada
COPY --from=builder /app/dist ./dist

# Definir ambiente de produção
ENV NODE_ENV=production

# Expor porta da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/server.js"]