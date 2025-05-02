# syntax=docker/dockerfile:1
FROM node:18-alpine AS builder
WORKDIR /app

# copiar definições de dependências e TypeScript
COPY package*.json tsconfig.json ./
RUN npm install

# copiar código fonte
COPY . .
# compilar para JavaScript (depende de script build ou tsc direto)
# se adicionou script no package.json:
# RUN npm run build
# se não, usar tsc:
RUN npx tsc --project tsconfig.json

FROM node:18-alpine
WORKDIR /app

# copiar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# copiar dist compilado
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]