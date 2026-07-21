# ===========================
# Etapa 1 - Build do Angular usando Bun
# ===========================
# Utilizamos a imagem oficial do Bun baseada em Alpine para manter a leveza
FROM oven/bun:alpine AS build

WORKDIR /app

# Copia os arquivos de definição de dependências
COPY ./sos_app/package*.json ./

# 'bun install --frozen-lockfile' é o equivalente direto e ultra rápido do 'npm ci'
RUN bun install --frozen-lockfile

COPY ./sos_app .

# Executa o script de build de produção utilizando o Bun
RUN bun run build

# ===========================
# Etapa 2 - Nginx
# ===========================
FROM nginx:alpine

COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# O Bun buildará o Angular exatamente no mesmo diretório configurado no seu angular.json
COPY --from=build /app/www/browser /usr/share/nginx/html