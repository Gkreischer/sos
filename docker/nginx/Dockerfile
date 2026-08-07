# ===========================
# Etapa 1 - Build do Angular usando Node.js
# ===========================
FROM docker.io/library/node:22-alpine AS build

WORKDIR /app

# Copia os arquivos de dependências
COPY ./sos_app/package*.json ./
COPY ./sos_app/capacitor-barcode-scanner-3.1.0.tgz ./

# Instala as dependências
RUN npm ci

# Copia o restante da aplicação
COPY ./sos_app .

# Executa o build de produção
RUN npm run build:all

# ===========================
# Etapa 2 - Nginx
# ===========================
FROM docker.io/library/nginx:stable-alpine

# Copia a configuração do Nginx
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados pelo Angular
COPY --from=build /app/www/browser /usr/share/nginx/html
COPY --from=build /app/dist/ticket-support/browser /usr/share/nginx/html/ticket-support
