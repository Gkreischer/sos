# SOS - Documentação Técnica

Visão técnica detalhada para desenvolvedores e gestores técnicos.

---

## 🏛️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        Nginx (Porta 9003)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  /main      │  │ /ticket-     │  │ /api, /sanctum,      │   │
│  │  (Admin)    │  │ support/     │  │ /broadcasting,       │   │
│  └──────┬──────┘  │ (Externo)    │  │ /app (WS), /storage  │   │
│         │         └──────┬───────┘  └──────────┬───────────┘   │
│         │                │                     │               │
│         ▼                ▼                     ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Docker Network                        │   │
│  │  ┌─────────┐  ┌────────┐  ┌─────────┐  ┌────────────┐   │   │
│  │  │Frontend │  │  API   │  │Postgres │  │   Redis    │   │   │
│  │  │(Build)  │  │(Laravel)│  │  18.4   │  │  (Alpine)  │   │   │
│  │  └─────────┘  └────┬───┘  └────┬────┘  └──────┬─────┘   │   │
│  └─────────────────────┼──────────┼────────────┼───────────┘   │
└────────────────────────┼──────────┼────────────┼───────────────┘
                         │          │            │
                    ┌────┴────┐ ┌───┴───┐  ┌─────┴────┐
                    │ Volumes │ │ Volumes│  │ Volumes  │
                    │frontend │ │  api   │  │ postgres │
                    │         │ │storage │  │_data     │
                    └─────────┘ └────────┘  └──────────┘
```

### Fluxo de Requisição

1. **Cliente** → Nginx (9003)
2. **Static assets** → Servidos diretamente do volume `frontend`
3. **API** (`/api/*`) → Proxy para `api:80` (Laravel)
4. **WebSocket** (`/app/*`) → Proxy para `api:8080` (Reverb)
5. **Auth** (`/sanctum/*`, `/broadcasting/*`) → Proxy para API
6. **Storage/Images** → Proxy para API

---

## 🛠️ Stack Tecnológica Detalhada

### Backend (sos_api/)

| Categoria | Tecnologia | Versão | Propósito |
|-----------|------------|--------|-----------|
| **Runtime** | PHP | 8.5 | Linguagem principal |
| **Framework** | Laravel | 12.x | API REST, auth, queues, scheduling |
| **Database** | PostgreSQL | 18.4 | Dados relacionais, JSONB, full-text |
| **Cache/Queue** | Redis | 7+ (Alpine) | Sessões, cache, filas, pub/sub |
| **Real-time** | Laravel Reverb | 1.10 | WebSocket server (Pusher-compatible) |
| **Auth** | Laravel Sanctum | 4.x | Token API, SPA auth |
| **Permissions** | spatie/laravel-permission | 6.25 | Roles & permissions |
| **Activity Log** | spatie/laravel-activitylog | 5.x | Auditoria de modelos |
| **Testing** | Pest PHP | 3.x | Testes unitários/feature |
| **Lint** | Laravel Pint | 1.13 | PSR-12 code style |
| **Process Manager** | shinsenter/laravel | php8.5-alpine | Supervisord (php-fpm + reverb + queue + scheduler) |

### Frontend (sos_app/)

| Categoria | Tecnologia | Versão | Propósito |
|-----------|------------|--------|-----------|
| **Framework** | Angular | 20.3 | SPA framework (signals, standalone) |
| **UI Library** | Ionic Framework | 8.8 | Componentes mobile/desktop |
| **Runtime** | Capacitor | 8.4 | Native bridge (Android/iOS/PWA) |
| **Charts** | Chart.js + ng2-charts | 4.3 / 8.0 | Gráficos interativos |
| **Charts Alt** | @swimlane/ngx-charts | 23.1 | Visualizações D3-based |
| **Forms** | @angular/forms + @maskito/* | 20.3 / 5.2 | Validação, máscaras |
| **QR/Barcode** | angularx-qrcode, jsbarcode, @capacitor/barcode-scanner | 20.0 / 3.12 / 3.1 | Geração/leitura |
| **State** | RxJS + Signals | 7.8 / 20.3 | Reatividade |
| **Printing** | ngx-print | 3.2 | Impressão de OS |
| **Export** | xlsx, xlsx-js-style | 0.20 / 1.2 | Excel export |
| **Testing** | Cypress + Jasmine/Karma | 15.17 / 5.2 | E2E + Unit |
| **Lint** | ESLint + Angular ESLint | 9.0 / 20.0 | Code quality |

### Infraestrutura

| Componente | Tecnologia | Configuração |
|------------|------------|--------------|
| **Container Runtime** | Docker / Podman | Compose v2 |
| **Reverse Proxy** | Nginx | Alpine, client_max_body_size 100M |
| **Orchestration** | Docker Compose | `prod/docker-compose.yml` |
| **Build Frontend** | Multi-stage Node | 22-alpine → build → nginx volume |
| **Build Backend** | shinsenter/laravel | php8.5-alpine, composer install --no-dev |
| **Network** | Bridge | `sos-network` isolado |
| **Volumes** | Named volumes | 5 volumes persistidos |

---

## 📦 Estrutura de Pastas

```
sos/
├── prod/                          # Produção (Docker Compose)
│   ├── docker-compose.yml         # Orquestração completa
│   ├── default.conf               # Nginx config (proxy + static)
│   └── Dockerfile.frontend        # Multi-stage Angular/Ionic build
├── sos_api/                       # Backend Laravel
│   ├── app/                       # Models, Controllers, Services, Jobs
│   ├── bootstrap/                 # App bootstrap
│   ├── config/                    # Configurações Laravel
│   ├── database/
│   │   ├── migrations/            # Schema versionado
│   │   ├── seeders/               # Dados iniciais (roles, users, status)
│   │   └── factories/             # Factories para testes
│   ├── docker/
│   │   ├── Dockerfile             # Imagem produção
│   │   └── 01-migrate.sh          # Entrypoint: migrate + seed + optimize
│   ├── routes/
│   │   ├── api.php                # API routes (Sanctum)
│   │   ├── web.php                # Web routes (painel externo)
│   │   └── channels.php           # Broadcasting channels
│   ├── tests/                     # Pest tests (Feature + Unit)
│   └── .env.example               # Template de configuração
├── sos_app/                       # Frontend Ionic/Angular
│   ├── src/
│   │   ├── app/                   # Components, pages, services
│   │   ├── environments/          # environment.ts / .prod.ts
│   │   └── theme/                 # Variáveis CSS/Ionic
│   ├── projects/
│   │   └── ticket-support/        # Projeto Ionic separado (painel externo)
│   ├── angular.json               # Workspace config (multi-project)
│   └── package.json               # Dependencies + scripts
├── .dockerignore                  # Build context optimization
├── .gitignore
├── LICENSE
└── README.md                      # Documentação geral
```

---

## 🔐 Autenticação & Autorização

### Sanctum (API Tokens)
- **Personal Access Tokens** para integrações
- **SPA Authentication** via cookies (SameSite=Lax, Secure)
- **Token Abilities** para escopo granular

### Roles & Permissions (Spatie)
```php
// Roles padrão (seeders)
Super Admin    → Acesso total
Admin          → Gestão de OS, usuários, relatórios
Technician     → Visualizar/atualizar OS atribuídas
Client         → Painel externo (read-only próprio)

// Permissions exemplos
orders.create, orders.view, orders.edit, orders.delete
users.manage, reports.view, settings.manage
```

### Reverb Broadcasting
- **Canais privados**: `App.Models.User.{id}` (notificações usuário)
- **Canais de presença**: `orders.{id}` (colaboração em tempo real)
- **Auth endpoint**: `/broadcasting/auth` (proxied by Nginx)

---

## 🗄️ Modelo de Dados (Principais Entidades)

```
User ─────────────< Order >───────────── Client
  │                   │
  │                   ├──< OrderItem >── Equipment
  │                   │
  │                   └──< OrderStatusHistory
  │
  ├── Role (Spatie)
  ├── Permission (Spatie)
  └── UserType (seeder)

BusinessInfo (singleton) → Configurações da empresa
Notification → Reverb events
```

### Tabelas Principais
| Tabela | Descrição |
|--------|-----------|
| `users` | Técnicos, admins, clientes (polymorphic) |
| `orders` | Ordens de serviço (status, prioridade, datas) |
| `order_items` | Itens/serviços por OS |
| `equipments` | Equipamentos dos clientes |
| `clients` | Dados de clientes (extends users) |
| `order_status_histories` | Auditoria de mudança de status |
| `activities` | Log de atividades (Spatie Activitylog) |

---

## 🔄 Fluxos Principais

### Criação de OS
```
POST /api/orders
  → Validate (FormRequest)
  → Create Order + Items
  → Dispatch Job: NotifyAssignedTechnician
  → Broadcast: orders.{id}.created
  → Return OrderResource
```

### Atualização de Status
```
PATCH /api/orders/{id}/status
  → Validate transition (state machine)
  → Create OrderStatusHistory
  → Update Order
  → Broadcast: orders.{id}.status_changed
  → Dispatch: SendClientNotification (if client)
```

### Painel Externo (Ticket Support)
```
GET /ticket-support/{token}
  → Validate public token (Order::where('public_token', $token))
  → Render Ionic/Angular app (subpath /ticket-support/)
  → Poll /api/orders/{id} para updates
  → WebSocket: orders.{id} (real-time)
```

---

## 🧪 Qualidade & Testes

### Backend
```bash
# Rodar testes
cd sos_api && ./vendor/bin/pest --coverage

# Lint
./vendor/bin/pint --test

# Static analysis (se configurado)
./vendor/bin/phpstan analyse
```

### Frontend
```bash
cd sos_app

# Unit tests
npm run test

# E2E
npm run cypress:run
npm run cypress:run:tickets

# Lint
npm run lint

# Build check
npm run build:all
```

### CI/CD Sugerido (GitHub Actions)
```yaml
# .github/workflows/ci.yml
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with: { php-version: '8.5', extensions: pgsql, redis }
      - run: cd sos_api && composer install --no-dev
      - run: cd sos_api && ./vendor/bin/pint --test
      - run: cd sos_api && ./vendor/bin/pest --coverage

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: cd sos_app && npm ci
      - run: cd sos_app && npm run lint
      - run: cd sos_app && npm run test
      - run: cd sos_app && npm run build:all
```

---

## 📊 Observabilidade

### Logs
```bash
# Laravel (stdout via supervisord)
docker logs sos-api -f

# Nginx access/error
docker logs sos-nginx -f

# PostgreSQL
docker logs sos-postgres -f
```

### Métricas Sugeridas
- **API**: Latência p50/p95/p99, taxa de erro, throughput
- **Queue**: Jobs processados, falhas, tempo de espera
- **WebSocket**: Conexões ativas, mensagens/s
- **DB**: Conexões, queries lentas, tamanho tabelas
- **Redis**: Memória, hit ratio, keys expiring

### Health Endpoints
| Endpoint | Service | Checks |
|----------|---------|--------|
| `GET /api/health` | Laravel | DB, Redis, Reverb |
| `GET /health` | Nginx | Static files, upstream |
| `pg_isready` | Postgres | Conexão + query simples |
| `redis-cli ping` | Redis | PONG |

---

## 🚀 Deploy em Produção

### Checklist Pré-Deploy
- [ ] `.env` com `APP_ENV=production`, `APP_DEBUG=false`
- [ ] `APP_KEY` gerada (`php artisan key:generate`)
- [ ] `REVERB_APP_KEY/SECRET` únicas e sincronizadas com frontend
- [ ] `DB_PASSWORD` forte, diferente do padrão
- [ ] SSL/TLS configurado no Nginx (Let's Encrypt / certificado próprio)
- [ ] Backups agendados (cron + pg_dump)
- [ ] Log aggregation (Loki, ELK, ou similar)
- [ ] Monitoring/alerting (Prometheus + Grafana)

### Escalabilidade Horizontal
```yaml
# docker-compose.override.yml (exemplo)
services:
  api:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 512M
    # Requer: session driver = redis, queue = redis
    # Reverb: sticky sessions ou Redis broadcaster
```

---

## 👥 Para Gestores de Contratação

### Competências Demonstradas

| Área | Evidência no Projeto |
|------|---------------------|
| **Backend Architecture** | Laravel 12, Domain-driven structure, Service classes, Jobs, Events |
| **API Design** | RESTful resources, API Resources (transformers), Sanctum auth |
| **Real-time** | Laravel Reverb, WebSocket, Broadcasting, Presence channels |
| **Database** | PostgreSQL 18, Migrations, Seeders, Factories, Relationships, JSONB |
| **Queue/Async** | Redis queues, Scheduled jobs, Failed job handling, Retry/backoff |
| **Frontend Modern** | Angular 20 (Signals, Standalone), Ionic 8, RxJS, Component architecture |
| **Mobile/PWA** | Capacitor, Barcode scanner, Camera, File system, Offline-ready |
| **Data Visualization** | Chart.js, ngx-charts, D3-based charts, Real-time updates |
| **Testing** | Pest (backend), Cypress/Jasmine (frontend), Coverage targets |
| **DevOps** | Multi-stage Docker, Docker Compose, Nginx proxy, Health checks, Volumes |
| **Security** | Non-root containers, Env secrets, Sanctum tokens, CORS, Rate limiting |
| **Code Quality** | Pint (PSR-12), ESLint, TypeScript strict, Type hints PHP 8.2+ |

### Complexidade do Projeto
- **~57+ Components** Angular/Ionic
- **Multi-project workspace** (admin + ticket-support)
- **Full-stack TypeScript + PHP** com tipos compartilhados via OpenAPI (sugerido)
- **Real-time bidirectional** communication
- **Production-ready** Docker deployment

---

## 📝 Convenções de Código

### Backend (PHP 8.2+)
```php
// Tipagem estrita
declare(strict_types=1);

// Readonly properties
final class OrderService
{
    public function __construct(
        private readonly OrderRepository $orders,
        private readonly NotificationService $notifications,
    ) {}

    public function create(CreateOrderDTO $dto): Order
    {
        return $this->orders->create($dto->toArray());
    }
}

// Enums backed
enum OrderStatus: string
{
    case Draft = 'draft';
    case Assigned = 'assigned';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
```

### Frontend (Angular 20 + Signals)
```typescript
// Standalone component + signals
@Component({ selector: 'app-order-card', standalone: true, ... })
export class OrderCardComponent {
  order = input.required<Order>();
  status = linkedSignal(() => this.order().status);

  // Computed derived state
  isUrgent = computed(() => this.order().priority === 'high');

  // Effect for side effects
  effect(() => {
    if (this.status() === 'completed') {
      this.analytics.track('order_completed', { id: this.order().id });
    }
  });
}
```

---

## 🔗 Links Úteis

- **Diagrama DB**: [dbdiagram.io](https://dbdiagram.io/d/SOS-631b5dd70911f91ba5744380)
- **Laravel 12 Docs**: https://laravel.com/docs/12.x
- **Angular 20 Docs**: https://angular.dev
- **Ionic 8 Docs**: https://ionicframework.com/docs
- **Reverb Docs**: https://reverb.laravel.com
- **Pest Docs**: https://pestphp.com

---

## 📄 Licença

MIT - Uso livre para fins comerciais e educacionais.

---

*Documentação mantida pela equipe SOS. Última atualização: v0.9*