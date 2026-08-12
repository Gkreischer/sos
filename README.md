# SOS - Sistema de Ordem de Serviço

Sistema de gerenciamento de ordens de serviço baseado em Laravel (backend) e Ionic com Angular (frontend), utilizando Docker Compose para deploy.

## 📋 Descrição

O SOS é um sistema completo de gerenciamento de ordens de serviço que permite:

- Gestão de ordens de serviço com código de barras
- Visualização de métricas e estatísticas
- Acompanhamento de histórico de clientes e equipamentos
- Painel externo para verificação de ordens (porta 9004)
- Sistema de notificações em tempo real via Reverb/Pusher
- Banco de dados PostgreSQL

## 🏗️ Estrutura do Projeto

```
.
├── docker/                    # Arquivos de configuração Docker
├── docker-compose.yml          # Composição dos serviços Docker
├── pgsql.env                 # Configuração do banco de dados MariaDB
├── sos_api/                    # Backend Laravel
│   ├── app/                    # Código da aplicação
│   ├── config/                 # Configurações
│   ├── database/         # Migrations e seeds
│   └── ...                     # Outros diretórios Laravel
└── sos_app/                    # Frontend Ionic com Angular
    ├── src/                    # Código fonte Angular
    ├── projects/             # Projetos do Ionic
    └── ...                     # Outros arquivos do frontend
```

## 🚀 Recursos Principais

- **Leitura de Código de Barras**: Escaneamento de códigos para identificação de ordens de serviço
- **Dashboard de Métricas**: Visualização de estatísticas e indicadores de desempenho
- **Painel Externo**: Interface pública para clientes verificarem o status de suas ordens (porta 9004)
- **Notificações em Tempo Real**: Utilizando Reverb/Pusher para atualizações instantâneas
- **Gestão Completa**: Criação, edição, visualização e acompanhamento de ordens de serviço
- **Histórico de cliente e equipamento**: Acompanhe todas as ordens feitas com poucos cliques

## 🛠️ Tecnologias Utilizadas

### Backend (Laravel)
- PHP 8.5
- Laravel Framework
- PostgreSQL
- Redis
- Reverb (para broadcasting)
- Docker Compose

### Frontend (Ionic com Angular)
- Ionic Framework
- Angular
- Capacitor
- Barcode Scanner

## 🗄️ Banco de Dados

[📊 Visualizar diagrama no dbdiagram.io](https://dbdiagram.io/d/SOS-631b5dd70911f91ba5744380)

## 🐳 Deploy com Docker Compose

O sistema utiliza Docker Compose para orquestrar todos os serviços necessários:

### Serviços
- **app**: Backend Laravel
- **nginx**: Servidor web para frontend
- **pgsql**: Banco de dados MariaDB
- **redis**: Cache e filas

### Portas Expostas
- **9003**: Interface administrativa do sistema
- **9004**: Painel externo para verificação de ordens (clientes)

## ⚙️ Configuração

### 1. Banco de Dados MariaDB
No arquivo `pgsql.example.env`, você precisa alterar a senha do usuário `sos` e renomear para `pgsql.env`:

```env
POSTGRES_USER=sos
POSTGRES_DB=sos
POSTGRES_PASSWORD=CHANGEYOURPASSWORD
```

### 2. Configuração do Backend Laravel
No arquivo `sos_api/.env`, você precisa alterar as seguintes variáveis:

```env
APP_KEY=GENERATEYOUROWNKEY
DB_PASSWORD=NOVA_SENHA_BANCO
REVERB_APP_ID=RANDOMNUMBER
REVERB_APP_KEY=GENERATEYOUROWNKEY (use a mesma key em environment.prod.ts, na pasta sos_app)
REVERB_APP_SECRET=GENERATEYOUROWNSECRET
```

## 🚀 Inicialização

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd sos
```

2. Inicie os serviços com Docker Compose:
```bash
docker-compose up -d
```

3. Acesse os serviços:
- Interface administrativa: http://localhost:9003
- Painel externo: http://localhost:9004

## 📝 Observações

- O sistema foi configurado para rodar em modo de produção
- Para desenvolvimento, configure o `.env` com `APP_ENV=local` e `APP_DEBUG=true`
- O painel externo permite verificação pública de ordens de serviço
- O sistema suporta leitura de código de barras para identificação rápida de ordens
- Métricas e estatísticas são apresentadas em dashboards interativos

## 🔧 Manutenção

### Atualizando dependências
```bash
# Backend Laravel
cd sos_api
composer install --no-dev

# Frontend Ionic
cd sos_app
npm install
```

### Backup do banco de dados
```bash
docker exec -it sos-pgsql pg_dump -U sos -d sos > backup_sos.sql
```

### Logs dos serviços
```bash
docker logs sos-backend
docker logs sos-nginx
docker logs sos-pgsql
```

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.