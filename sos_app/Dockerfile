# Dockerfile for SOS Angular/Ionic app (production)
# Multi-stage build: Build with Node.js, serve with nginx

# ===========================
# Etapa 1 - Build do Angular usando Node.js
# ===========================
FROM node:22-alpine AS build

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./
COPY capacitor-barcode-scanner-3.1.0.tgz ./

# Instala as dependências
RUN npm ci

# Copia o restante da aplicação
COPY . .

# Executa o build de produção para ambos os projetos
RUN npm run build:all

# ===========================
# Etapa 2 - Nginx
# ===========================
FROM nginx:stable-alpine

# Remove o conteúdo padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia a configuração do nginx from project root
COPY ../docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados pelo Angular
COPY --from=build /app/www/browser /usr/share/nginx/html
COPY --from=build /app/dist/ticket-support/browser /usr/share/nginx/html/ticket-support

# Expõe a porta 80 (padrão do nginx)
EXPOSE 80

# O nginx já vem configurado para rodar em foreground
CMD ["nginx", "-g", "daemon off;"]