# Etapa 1: Build da aplicação
FROM node:20-alpine AS builder

# Instala o bash
RUN apk add --no-cache bash

WORKDIR /app

# Copia os arquivos de dependências e instala todas as dependências (incluindo as de desenvolvimento)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts --network-timeout-100000

# Copia o arquivo .env necessário para o build
COPY .env ./

# Copia todo o código da aplicação para dentro do container
COPY . .

# Compila o código (ajuste o comando conforme definido no seu package.json)
RUN yarn build

# Etapa 2: Imagem final de produção
FROM node:20-alpine

WORKDIR /app

# Instala o bash e o curl na imagem final
RUN apk add --no-cache bash curl

# Copia os arquivos de dependências para instalar somente as dependências de produção
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts --network-timeout-100000
RUN npm install --save --legacy-peer-deps @sentry/node @sentry/tracing

# Copia os arquivos compilados da etapa de build
COPY --from=builder /app/.next ./.next

# Copia o diretório src para que os arquivos TS estejam disponíveis para os comandos de seeding
COPY tsconfig.json ./
COPY public ./public

# Expõe a porta que a aplicação irá utilizar
EXPOSE $PORT

# Comando para iniciar a aplicação
CMD ["yarn", "start"]
