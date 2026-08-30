# SOS - Sistema de Ordem de Serviço

Sistema completo de gerenciamento de ordens de serviço com backend Laravel, frontend Ionic/Angular e deploy via Docker Compose.

## 🎥 Demonstração

[![Demonstração do sistema](https://img.youtube.com/vi/ZrbIOm732Lk/maxresdefault.jpg)](https://youtu.be/ZrbIOm732Lk)

---

## 📋 Visão Geral

O SOS permite gestão completa de ordens de serviço com:

- **Código de barras** para identificação rápida
- **Dashboard de métricas** com gráficos interativos
- **Painel externo** para clientes verificarem status
- **Notificações em tempo real** via Laravel Reverb
- **Histórico de clientes e equipamentos**

---

## 🛠️ Tecnologias

| Camada        | Tecnologias                                                        |
| ------------- | ------------------------------------------------------------------ |
| **Backend**   | PHP 8.5, Laravel 12, PostgreSQL 18, Redis, Laravel Reverb, Sanctum |
| **Frontend**  | Angular 20, Ionic 8, Capacitor, Chart.js, ngx-charts               |
| **Deploy**    | Docker Compose (prod/), Nginx, Multi-stage builds                  |
| **Qualidade** | Pest (testes), Pint (lint), ESLint, Cypress (E2E)                  |

---

## 🏗️ Arquitetura

```
sos/
├── prod/                    # Docker Compose de produção
│   ├── docker-compose.yml   # Orquestração dos serviços
│   ├── default.conf         # Configuração Nginx
│   └── Dockerfile.frontend  # Build do frontend (Angular + Ionic)
├── sos_api/                 # Backend Laravel
│   ├── docker/Dockerfile    # Imagem da API
│   └── docker/01-migrate.sh # Inicialização (migrate + seed)
├── sos_app/                 # Frontend Ionic/Angular
└── .dockerignore            # Otimização do build context
```

### Serviços (docker-compose.yml)

| Serviço      | Imagem                           | Porta          | Descrição                            |
| ------------ | -------------------------------- | -------------- | ------------------------------------ |
| **nginx**    | nginx:alpine                     | 9003:80        | Proxy reverso + serve frontend       |
| **api**      | shinsenter/laravel:php8.5-alpine | 80 (interno)   | Laravel + Reverb + Queue + Scheduler |
| **postgres** | postgres:18.4-alpine             | 5432 (interno) | Banco de dados principal             |
| **redis**    | redis:alpine                     | 6379 (interno) | Cache, sessões, filas                |
| **frontend** | node:22-alpine                   | —              | Build do Angular/Ionic (stage)       |

### Portas Expostas

- **9003** → Interface administrativa (nginx serve frontend + proxy API)

---

## 🚀 Deploy com Docker Compose (ou Podman)

### Pré-requisitos

- **Docker** 24+ / **Podman** 4+ com compose
- Porta 9003 livre no host

### 1. Clone e prepare

```bash
git clone <url-do-repositorio>
cd sos
```

### 2. Configure variáveis de ambiente

```bash
# Backend
cp sos_api/.env.example sos_api/.env
# Edite sos_api/.env com suas chaves:
#   APP_KEY=base64:...
#   REVERB_APP_KEY=...
#   REVERB_APP_SECRET=...
#   DB_PASSWORD=senha_segura
```

### 3. Suba a stack

```bash
# Docker
docker compose -f prod/docker-compose.yml up -d --build

# Podman (mesmo comando)
podman compose -f prod/docker-compose.yml up -d --build
```

### 4. Acesse

| Interface          | URL                                   |
| ------------------ | ------------------------------------- |
| **Admin**          | http://localhost:9003                 |
| **Painel Externo** | http://localhost:9003/ticket-support/ |

---

## ⚙️ Configuração Detalhada

### Variáveis Obrigatórias (sos_api/.env)

```env
APP_NAME=SOSDB
APP_ENV=production
APP_KEY=base64:GERE_COM_php_artisan_key:generate
APP_DEBUG=false

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=sos
DB_USERNAME=sos
DB_PASSWORD=SUA_SENHA_SEGURA

REVERB_APP_ID=123456
REVERB_APP_KEY=CHAVE_UNICA_DO_APP
REVERB_APP_SECRET=SEGREDO_DO_APP
REVERB_HOST=127.0.0.1
REVERB_PORT=8080
REVERB_SCHEME=http

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=redis
REDIS_PORT=6379
```

> **Nota**: Use a mesma `REVERB_APP_KEY` no frontend (`sos_app/src/environments/environment.prod.ts`).

### Volumes Persistidos

| Volume                | Conteúdo                        |
| --------------------- | ------------------------------- |
| `postgres_data`       | Dados do PostgreSQL             |
| `redis_data`          | Cache/filas do Redis            |
| `api-storage`         | `storage/` do Laravel           |
| `api-bootstrap-cache` | Cache de bootstrap do Laravel   |
| `frontend`            | Build estático do Angular/Ionic |

---

## 🔧 Operações Comuns

```bash
# Ver logs
docker compose -f prod/docker-compose.yml logs -f api
docker compose -f prod/docker-compose.yml logs -f nginx

# Backup do banco
docker exec sos-postgres pg_dump -U sos -d sos > backup_$(date +%F).sql

# Restaurar backup
cat backup.sql | docker exec -i sos-postgres psql -U sos -d sos

# Executar comandos artisan
docker exec sos-api php artisan migrate:status
docker exec sos-api php artisan queue:restart
docker exec sos-api php artisan optimize

# Rebuild apenas frontend
docker compose -f prod/docker-compose.yml build frontend
docker compose -f prod/docker-compose.yml up -d frontend nginx

# Parar tudo
docker compose -f prod/docker-compose.yml down

# Parar + remover volumes (CUIDADO: apaga dados)
docker compose -f prod/docker-compose.yml down -v
```

---

## 🏥 Health Checks

Todos os serviços possuem health checks configurados:

```bash
# Status geral
docker compose -f prod/docker-compose.yml ps

# Verificação manual
curl -f http://localhost:9003/api/health   # API
curl -f http://localhost:9003/health       # Nginx + Frontend
```

---

## 🔒 Segurança

- Containers rodam como usuário não-root (`www-data` / `node`)
- Nginx limita upload a 100MB
- Variáveis sensíveis apenas via `.env` (nunca commite)
- Reverb WebSocket isolado na rede interna
- PostgreSQL/Redis não expostos no host

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE)

---

## 👨‍💻 Autor

**Gustavo Kreischer de Almeida**  
Sistema SOS v0.9
