# Whitelabel Finance — Especificação do Back-end

> Gerado a partir do contrato do front-end em 20/04/2026.
> Este documento é a **fonte de verdade** para implementar a API.
> Qualquer divergência entre este doc e o front-end é um bug.

---

## Sumário

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Stack Recomendada](#2-stack-recomendada)
3. [Configuração do Projeto](#3-configuração-do-projeto)
4. [Multi-Tenancy](#4-multi-tenancy)
5. [Autenticação & Autorização](#5-autenticação--autorização)
6. [Contrato de Erros](#6-contrato-de-erros)
7. [Modelo de Dados (ERD)](#7-modelo-de-dados-erd)
8. [API — Endpoints Detalhados](#8-api--endpoints-detalhados)
   - 8.1 [Auth](#81-auth)
   - 8.2 [Dashboard](#82-dashboard)
   - 8.3 [Transactions](#83-transactions)
   - 8.4 [Operations](#84-operations)
   - 8.5 [Portfolio](#85-portfolio)
   - 8.6 [Reports](#86-reports)
   - 8.7 [Settings](#87-settings)
   - 8.8 [Tenant Config](#88-tenant-config)
9. [Regras de Negócio](#9-regras-de-negócio)
10. [Feature Flags por Tenant](#10-feature-flags-por-tenant)
11. [Variáveis de Ambiente](#11-variáveis-de-ambiente)
12. [Estrutura de Pastas Sugerida](#12-estrutura-de-pastas-sugerida)
13. [Checklist de Implementação](#13-checklist-de-implementação)

---

## 1. Visão Geral da Arquitetura

```
┌──────────────┐       HTTPS/JSON        ┌──────────────────┐
│  Front-end   │ ◄────────────────────►   │    API (REST)     │
│  (React SPA) │    Bearer Token          │   /api/*          │
│              │    X-Tenant-ID header    │                   │
└──────────────┘                          └────────┬─────────┘
                                                   │
                                          ┌────────▼─────────┐
                                          │   PostgreSQL      │
                                          │   (multi-tenant)  │
                                          └──────────────────┘
```

### Princípios

- **REST JSON** — todos os endpoints recebem e retornam `application/json`
- **Multi-tenant por header** — `X-Tenant-ID` em todo request autenticado
- **Autenticação stateless** — JWT Bearer token
- **Isolamento de dados** — filtro `tenant_id` em toda query ao banco
- **Timeout do front**: 15 segundos — respostas devem ser < 10s

---

## 2. Stack Recomendada

| Camada       | Opção Principal       | Alternativa        |
| ------------ | --------------------- | ------------------ |
| Runtime      | Node.js 20 LTS        | —                  |
| Framework    | NestJS                | Express + tsyringe |
| Linguagem    | TypeScript 5.x        | —                  |
| Banco        | PostgreSQL 16         | —                  |
| ORM          | Prisma                | TypeORM / Drizzle  |
| Auth         | JWT (jsonwebtoken)    | Passport.js        |
| Validação    | Zod / class-validator | —                  |
| Testes       | Vitest / Jest         | —                  |
| Migrations   | Prisma Migrate        | —                  |
| Documentação | Swagger (auto-gen)    | —                  |

---

## 3. Configuração do Projeto

### Base URL

O front usa `VITE_API_BASE_URL` (default `/api`).
A API deve servir todos os endpoints sob o prefixo `/api`.

```
GET /api/auth/me
POST /api/transactions
GET /api/tenants/acme/config
```

### Headers esperados pelo front

| Header          | Descrição                            | Obrigatório             |
| --------------- | ------------------------------------ | ----------------------- |
| `Authorization` | `Bearer <jwt_token>`                 | Sim (exceto login)      |
| `X-Tenant-ID`   | ID do tenant (ex: `default`, `acme`) | Sim (exceto login)      |
| `Content-Type`  | `application/json`                   | Sim (em POST/PUT/PATCH) |

### CORS

Permitir `Authorization`, `X-Tenant-ID`, `Content-Type` nos headers.
Permitir métodos `GET, POST, PUT, PATCH, DELETE, OPTIONS`.

---

## 4. Multi-Tenancy

### Estratégia: Row-Level Filtering

Toda tabela (exceto `tenants`) tem uma coluna `tenant_id VARCHAR NOT NULL`.
Toda query DEVE filtrar por `tenant_id`.

### Resolução do Tenant

O front resolve o tenant assim (prioridade):

1. `VITE_TENANT_ID` (env variable)
2. Subdomínio do hostname (ex: `acme.app.com` → `acme`)
3. Fallback: `default`

O back deve:

1. Ler `X-Tenant-ID` do header
2. Validar que o tenant existe na tabela `tenants`
3. Retornar `403` se o tenant não existir ou estiver inativo
4. Injetar `tenant_id` em toda query

### Tabela `tenants`

```sql
CREATE TABLE tenants (
  id          VARCHAR(50) PRIMARY KEY,        -- 'default', 'acme'
  name        VARCHAR(255) NOT NULL,          -- 'White Label Finance'
  is_active   BOOLEAN NOT NULL DEFAULT true,
  config      JSONB NOT NULL,                 -- TenantConfig completo
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

A coluna `config` armazena o `TenantConfig` completo:

```typescript
interface TenantConfig {
  id: string
  name: string
  theme: {
    colorPrimary: string // ex: '#2563eb'
    colorPrimaryForeground: string
    colorSecondary: string
    colorSecondaryForeground: string
    colorBackground: string
    colorForeground: string
    colorMuted: string
    colorMutedForeground: string
    colorBorder: string
    logoUrl: string // ex: '/logo.svg'
    fontFamily: string // ex: 'Inter, system-ui, sans-serif'
    radiusSm?: string
    radiusMd?: string
    radiusLg?: string
    radiusXl?: string
  }
  features: FeatureFlag[]
  appConfig: {
    currencyCode: string // 'BRL' | 'USD' | 'EUR'
    locale: string // 'pt-BR' | 'en-US'
    supportEmail: string
  }
}

type FeatureFlag =
  | 'reports'
  | 'investments'
  | 'credit'
  | 'notifications'
  | 'multi-account'
  | 'export-csv'
  | 'audit-log'
  | 'portfolio'
  | 'market-overview'
  | 'operations'
  | 'ai-insights'
```

---

## 5. Autenticação & Autorização

### Fluxo

```
1. POST /api/auth/login  → { token, user }
2. Front salva token em localStorage
3. Toda request envia: Authorization: Bearer <token>
4. API valida JWT em middleware
5. Se 401 → front faz logout automático
```

### JWT Payload

```typescript
interface JwtPayload {
  sub: string // user.id
  email: string
  role: 'admin' | 'manager' | 'viewer'
  tenantId: string
  iat: number
  exp: number
}
```

### Roles

| Role      | Permissões                                           |
| --------- | ---------------------------------------------------- |
| `admin`   | CRUD completo em tudo, settings de plataforma        |
| `manager` | CRUD em transactions/operations, leitura de settings |
| `viewer`  | Somente leitura (dashboard, portfolio, reports)      |

### Endpoints públicos (sem token)

- `POST /api/auth/login`
- `GET /api/tenants/:id/config`

### Middleware de Auth

```
1. Extrair token do header Authorization
2. Verificar assinatura JWT
3. Verificar expiração
4. Verificar que user.tenantId === X-Tenant-ID header
5. Anexar user ao request context
6. Se falhar → retornar 401
```

---

## 6. Contrato de Erros

O front espera **exatamente** esta estrutura em toda resposta de erro:

```typescript
// Response body para 4xx/5xx
interface ApiErrorResponse {
  message: string // Mensagem human-readable (exibida no UI)
  error?: string // Código ou tipo do erro (opcional)
  field?: string // Campo com erro de validação (opcional)
  code?: string // Código machine-readable (opcional)
}
```

### Mapeamento de Status

| Status | Quando usar                         | `message` exemplo                          |
| ------ | ----------------------------------- | ------------------------------------------ |
| `400`  | Payload inválido / bad request      | `"O campo 'amount' deve ser positivo"`     |
| `401`  | Token ausente, expirado ou inválido | `"Sessão expirada. Faça login novamente."` |
| `403`  | Sem permissão (role insuficiente)   | `"Você não tem permissão para esta ação."` |
| `404`  | Recurso não encontrado              | `"Transação não encontrada."`              |
| `409`  | Conflito (duplicata)                | `"Este registro já existe."`               |
| `422`  | Validação de negócio falhou         | `"Quantidade insuficiente para venda."`    |
| `500`  | Erro interno não esperado           | `"Erro interno do servidor."`              |

### Exemplo de erro com campo

```json
{
  "message": "O campo email já está em uso.",
  "field": "email",
  "code": "CONFLICT"
}
```

### Validação com múltiplos campos

Para formulários, retorne `422` com o **primeiro** campo inválido no `field`.
O front exibe erros campo a campo — só precisa de um por vez.

---

## 7. Modelo de Dados (ERD)

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   tenants    │       │     users        │       │  transactions    │
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)      │◄──┐   │ id (PK, UUID)    │       │ id (PK, UUID)    │
│ name         │   │   │ tenant_id (FK)───┤───►   │ tenant_id (FK)   │
│ is_active    │   │   │ name             │       │ user_id (FK)     │
│ config (JSON)│   │   │ email (UNIQUE*)  │       │ title            │
│ created_at   │   │   │ password_hash    │       │ type             │
│ updated_at   │   │   │ role             │       │ amount           │
└──────────────┘   │   │ created_at       │       │ category         │
                   │   │ updated_at       │       │ date             │
                   │   └──────────────────┘       │ status           │
                   │                              │ description      │
                   │   ┌──────────────────┐       │ created_at       │
                   │   │   operations     │       │ updated_at       │
                   │   ├──────────────────┤       └──────────────────┘
                   │   │ id (PK, UUID)    │
                   ├───┤ tenant_id (FK)   │       ┌──────────────────┐
                   │   │ user_id (FK)     │       │  user_settings   │
                   │   │ symbol           │       ├──────────────────┤
                   │   │ asset_name       │       │ id (PK, UUID)    │
                   │   │ asset_type       │       │ tenant_id (FK)   │
                   │   │ operation_type   │       │ user_id (FK, UQ) │
                   │   │ quantity         │       │ profile (JSON)   │
                   │   │ unit_price       │       │ preferences(JSON)│
                   │   │ total_amount     │       │ platform (JSON)  │
                   │   │ fees             │       │ created_at       │
                   │   │ operation_date   │       │ updated_at       │
                   │   │ broker           │       └──────────────────┘
                   │   │ notes            │
                   │   │ created_at       │
                   │   │ updated_at       │
                   │   └──────────────────┘
                   │
                   │   * email UNIQUE dentro de cada tenant_id
                   │     (UNIQUE constraint em (tenant_id, email))
```

### SQL — Criação das tabelas

```sql
-- ─── Users ────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     VARCHAR(50) NOT NULL REFERENCES tenants(id),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'viewer'
                CHECK (role IN ('admin', 'manager', 'viewer')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, email)
);

-- ─── Transactions ─────────────────────────────────────────────────────────
CREATE TABLE transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   VARCHAR(50) NOT NULL REFERENCES tenants(id),
  user_id     UUID NOT NULL REFERENCES users(id),
  title       VARCHAR(255) NOT NULL,
  type        VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount      DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  category    VARCHAR(100) NOT NULL,
  date        TIMESTAMPTZ NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'completed'
              CHECK (status IN ('completed', 'pending', 'cancelled')),
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_tenant ON transactions(tenant_id);
CREATE INDEX idx_transactions_user ON transactions(tenant_id, user_id);
CREATE INDEX idx_transactions_date ON transactions(tenant_id, date DESC);
CREATE INDEX idx_transactions_type ON transactions(tenant_id, type);

-- ─── Operations ───────────────────────────────────────────────────────────
CREATE TABLE operations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      VARCHAR(50) NOT NULL REFERENCES tenants(id),
  user_id        UUID NOT NULL REFERENCES users(id),
  symbol         VARCHAR(20) NOT NULL,
  asset_name     VARCHAR(255) NOT NULL,
  asset_type     VARCHAR(20) NOT NULL
                 CHECK (asset_type IN ('stock','fii','bdr','etf','fixed-income','crypto')),
  operation_type VARCHAR(10) NOT NULL CHECK (operation_type IN ('buy', 'sell')),
  quantity       DECIMAL(15, 6) NOT NULL CHECK (quantity > 0),
  unit_price     DECIMAL(15, 4) NOT NULL CHECK (unit_price > 0),
  total_amount   DECIMAL(15, 2) NOT NULL,  -- computed: (quantity * unit_price) + fees
  fees           DECIMAL(15, 2) NOT NULL DEFAULT 0 CHECK (fees >= 0),
  operation_date TIMESTAMPTZ NOT NULL,
  broker         VARCHAR(255),
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_operations_tenant ON operations(tenant_id);
CREATE INDEX idx_operations_user ON operations(tenant_id, user_id);
CREATE INDEX idx_operations_symbol ON operations(tenant_id, symbol);
CREATE INDEX idx_operations_date ON operations(tenant_id, operation_date DESC);

-- ─── User Settings ────────────────────────────────────────────────────────
CREATE TABLE user_settings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   VARCHAR(50) NOT NULL REFERENCES tenants(id),
  user_id     UUID NOT NULL REFERENCES users(id),
  profile     JSONB NOT NULL DEFAULT '{}',
  preferences JSONB NOT NULL DEFAULT '{}',
  platform    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, user_id)
);
```

---

## 8. API — Endpoints Detalhados

### 8.1 Auth

#### `POST /api/auth/login`

**Público** — sem token.

**Request:**

```json
{
  "email": "admin@demo.com",
  "password": "admin123"
}
```

**Response `200`:**

```json
{
  "token": "eyJhbG...",
  "user": {
    "id": "uuid-aqui",
    "name": "Admin Demo",
    "email": "admin@demo.com",
    "role": "admin",
    "tenantId": "default"
  }
}
```

**Erros:**
| Status | Quando |
|--------|-------------------------------------|
| `401` | Email/senha inválidos |
| `403` | Tenant inativo |

**Regras:**

- Buscar user por `(email, tenant_id)`
- Comparar senha com bcrypt
- Gerar JWT com expiração configurável (sugerido: 24h)
- Retornar user sem `password_hash`

---

#### `POST /api/auth/logout`

**Autenticado.**

**Request:** body vazio.

**Response `204`:** sem body.

**Regras:**

- Opcional: blacklist do token (se implementar invalidação server-side)
- O front trata erros silenciosamente (`.catch(() => undefined)`)

---

#### `GET /api/auth/me`

**Autenticado.**

**Response `200`:**

```json
{
  "id": "uuid",
  "name": "Admin Demo",
  "email": "admin@demo.com",
  "role": "admin",
  "tenantId": "default"
}
```

**Regras:**

- Decodificar JWT, buscar user por `id` + `tenant_id`
- Se user não existe mais → retornar `401`
- Usado pelo front para restaurar sessão ao recarregar a página

---

### 8.2 Dashboard

Todos **autenticados**. Dados são **computados/agregados** do banco.

#### `GET /api/dashboard/summary?period=<period>`

**Query params:**
| Param | Tipo | Valores | Obrigatório |
|----------|--------|-------------------------------------|-------------|
| `period` | string | `today`, `7d`, `30d`, `current-month` | Sim |

**Response `200`:**

```json
{
  "balance": {
    "label": "Saldo atual",
    "value": 12450.0,
    "previousValue": 11200.0,
    "isCurrency": true
  },
  "income": {
    "label": "Receitas",
    "value": 1200.0,
    "previousValue": 980.0,
    "isCurrency": true
  },
  "expenses": {
    "label": "Despesas",
    "value": 340.0,
    "previousValue": 420.0,
    "isCurrency": true
  },
  "transactionCount": {
    "label": "Transações",
    "value": 5,
    "previousValue": 4,
    "isCurrency": false
  }
}
```

**Regras de cálculo:**

- `balance.value` = soma de `income` - soma de `expense` do período (transações `completed`)
- `income.value` = soma dos `amount` onde `type = 'income'` no período
- `expenses.value` = soma dos `amount` onde `type = 'expense'` no período
- `transactionCount.value` = count de transações no período
- `previousValue` = mesmos cálculos para o período anterior de igual duração
  - `today` → ontem
  - `7d` → 7 dias anteriores
  - `30d` → 30 dias anteriores
  - `current-month` → mês anterior

---

#### `GET /api/dashboard/chart?period=<period>`

**Query params:** mesmo que summary.

**Response `200`:**

```json
[
  { "label": "Seg", "income": 5000, "expenses": 1800 },
  { "label": "Ter", "income": 0, "expenses": 500 },
  { "label": "Qua", "income": 1200, "expenses": 380 }
]
```

**Array de `ChartDataPoint`:**

```typescript
interface ChartDataPoint {
  label: string // Rótulo do eixo X
  income: number // Total de receitas no bucket
  expenses: number // Total de despesas no bucket
}
```

**Regras de agrupamento (bucketing):**
| Período | Granularidade | Labels |
|-----------------|---------------|---------------------------|
| `today` | 3h | `00h`, `03h`, `06h`, ... |
| `7d` | 1 dia | `Seg`, `Ter`, `Qua`, ... |
| `30d` | 1 semana | `Sem 1`, `Sem 2`, ... |
| `current-month` | 1 semana | `Sem 1`, `Sem 2`, `Atual` |

---

#### `GET /api/dashboard/transactions/recent?period=<period>`

**Query params:** mesmo que summary.

**Response `200`:**

```json
[
  {
    "id": "uuid",
    "description": "Salário",
    "amount": 5000,
    "type": "income",
    "category": "Trabalho",
    "date": "2026-04-15T10:00:00Z"
  }
]
```

**Array de `RecentTransaction`:**

```typescript
interface RecentTransaction {
  id: string
  description: string // = transaction.title
  amount: number // Sempre positivo
  type: 'income' | 'expense'
  category: string
  date: string // ISO 8601
}
```

**Regras:**

- Filtrar transações do período com `status = 'completed'`
- Ordenar por `date DESC`
- Limitar a **7 itens** (front exibe até 7)
- `description` = campo `title` da transaction

---

### 8.3 Transactions

CRUD completo. Todos **autenticados**.

#### `GET /api/transactions`

**Query params (todos opcionais):**
| Param | Tipo | Descrição |
|------------|--------|-------------------------------------------------|
| `search` | string | Busca em `title` e `category` (case-insensitive)|
| `type` | string | `income`, `expense`, ou `all` (default) |
| `category` | string | Filtro exato por categoria |
| `dateFrom` | string | ISO date — transações >= esta data |
| `dateTo` | string | ISO date — transações <= esta data 23:59:59 |
| `orderBy` | string | `date` (default), `amount`, `title` |
| `orderDir` | string | `asc` ou `desc` (default) |

**Response `200`:**

```json
[
  {
    "id": "uuid",
    "title": "Salário",
    "type": "income",
    "amount": 5000,
    "category": "Trabalho",
    "date": "2026-04-15T10:00:00Z",
    "status": "completed",
    "description": "Salário mensal",
    "createdAt": "2026-04-15T10:00:00Z",
    "updatedAt": "2026-04-15T10:00:00Z"
  }
]
```

**Tipo `Transaction`:**

```typescript
interface Transaction {
  id: string
  title: string
  type: 'income' | 'expense'
  amount: number // Sempre positivo
  category: string
  date: string // ISO 8601
  status: 'completed' | 'pending' | 'cancelled'
  description?: string
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}
```

---

#### `POST /api/transactions`

**Request:**

```json
{
  "title": "Supermercado",
  "type": "expense",
  "amount": 380,
  "category": "Alimentação",
  "date": "2026-04-12T18:00:00Z",
  "status": "completed",
  "description": "Compras da semana"
}
```

**Payload `CreateTransactionPayload`:**

```typescript
// Todos os campos de Transaction EXCETO: id, createdAt, updatedAt
interface CreateTransactionPayload {
  title: string
  type: 'income' | 'expense'
  amount: number
  category: string
  date: string
  status: 'completed' | 'pending' | 'cancelled'
  description?: string
}
```

**Response `201`:** Transaction completa (com `id`, `createdAt`, `updatedAt`).

**Validações:**
| Campo | Regra |
|------------|---------------------------------------------|
| `title` | Obrigatório, 1-255 chars |
| `type` | Obrigatório, enum `income` \| `expense` |
| `amount` | Obrigatório, > 0 |
| `category` | Obrigatório, 1-100 chars |
| `date` | Obrigatório, ISO 8601 válido |
| `status` | Obrigatório, enum `completed` \| `pending` \| `cancelled` |

---

#### `PUT /api/transactions/:id`

**Request:** `UpdateTransactionPayload` — todos os campos opcionais exceto `id` (na URL).

```json
{
  "title": "Supermercado Extra",
  "amount": 420
}
```

**Response `200`:** Transaction atualizada completa.

**Erros:**
| Status | Quando |
|--------|---------------------------------------------|
| `404` | Transaction não encontrada neste tenant |
| `403` | User sem permissão para editar |

---

#### `DELETE /api/transactions/:id`

**Response `204`:** sem body.

**Erros:**
| Status | Quando |
|--------|---------------------------------------------|
| `404` | Transaction não encontrada neste tenant |

---

### 8.4 Operations

CRUD completo. Todos **autenticados**.

#### `GET /api/operations`

**Query params (todos opcionais):**
| Param | Tipo | Descrição |
|------------------|--------|----------------------------------------------|
| `search` | string | Busca em `symbol` e `asset_name` |
| `operationType` | string | `buy`, `sell`, ou `all` (default) |
| `assetType` | string | `stock`, `fii`, `bdr`, `etf`, `fixed-income`, `crypto`, ou `all` |
| `startDate` | string | ISO date — operações >= esta data |
| `endDate` | string | ISO date — operações <= esta data 23:59:59 |
| `orderBy` | string | `date` (default), `totalAmount`, `symbol` |
| `orderDirection` | string | `asc` ou `desc` (default) |

**Nota:** Quando chamado **sem filtros**, retorna todas as operações do user (usado pelo módulo de reports/portfolio).

**Response `200`:**

```json
[
  {
    "id": "uuid",
    "symbol": "PETR4",
    "assetName": "Petrobras PN",
    "assetType": "stock",
    "operationType": "buy",
    "quantity": 200,
    "unitPrice": 32.5,
    "totalAmount": 6510.0,
    "fees": 10.0,
    "operationDate": "2026-01-10T10:00:00Z",
    "broker": "XP Investimentos",
    "notes": null,
    "createdAt": "2026-01-10T10:00:00Z",
    "updatedAt": "2026-01-10T10:00:00Z"
  }
]
```

**Tipo `Operation`:**

```typescript
interface Operation {
  id: string
  symbol: string
  assetName: string
  assetType: 'stock' | 'fii' | 'bdr' | 'etf' | 'fixed-income' | 'crypto'
  operationType: 'buy' | 'sell'
  quantity: number
  unitPrice: number
  totalAmount: number // COMPUTADO: (quantity * unitPrice) + fees
  fees: number
  operationDate: string // ISO 8601
  broker?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
```

---

#### `POST /api/operations`

**Request:**

```json
{
  "symbol": "PETR4",
  "assetType": "stock",
  "operationType": "buy",
  "quantity": 200,
  "unitPrice": 32.5,
  "fees": 10.0,
  "operationDate": "2026-01-10T10:00:00Z",
  "broker": "XP Investimentos",
  "notes": "Compra mensal"
}
```

**Payload `CreateOperationPayload`:**

```typescript
interface CreateOperationPayload {
  symbol: string
  assetType: 'stock' | 'fii' | 'bdr' | 'etf' | 'fixed-income' | 'crypto'
  operationType: 'buy' | 'sell'
  quantity: number
  unitPrice: number
  fees: number
  operationDate: string
  broker?: string
  notes?: string
}
```

**Response `201`:** Operation completa.

**Regras do back-end:**

1. `totalAmount` = `(quantity * unitPrice) + fees` — computado pelo servidor, nunca confiado pelo client
2. `assetName` = resolver a partir do `symbol` (manter lookup table ou serviço de ativos)
3. Se `operationType = 'sell'`, validar que o user tem `quantity` suficiente desse ativo (soma de buys - soma de sells)

**Validações:**
| Campo | Regra |
|-----------------|----------------------------------------------------------|
| `symbol` | Obrigatório, 1-20 chars, uppercase |
| `assetType` | Obrigatório, enum |
| `operationType` | Obrigatório, `buy` \| `sell` |
| `quantity` | Obrigatório, > 0 |
| `unitPrice` | Obrigatório, > 0 |
| `fees` | Obrigatório, >= 0 |
| `operationDate` | Obrigatório, ISO 8601 válido, não pode ser no futuro |

---

#### `PUT /api/operations/:id`

**Request:** `UpdateOperationPayload` — todos os campos de Create (obrigatórios) + `id` na URL.

**Response `200`:** Operation atualizada.

**Regras:**

- Recomputar `totalAmount`
- Re-resolver `assetName`
- Validar venda se necessário

---

#### `DELETE /api/operations/:id`

**Response `204`:** sem body.

**Regras:**

- Validar que deletar essa operação não deixa posição negativa
- Se a operação for uma compra e existirem vendas posteriores que dependem dela → retornar `422`

---

### 8.5 Portfolio

**Autenticado.** Somente leitura — dados derivados das operations.

#### `GET /api/portfolio/positions`

**Response `200`:**

```json
{
  "positions": [
    {
      "symbol": "PETR4",
      "name": "Petrobras PN",
      "type": "stock",
      "quantity": 200,
      "averagePrice": 32.5,
      "investedAmount": 6500.0,
      "currentPrice": 38.2,
      "currentValue": 7640.0,
      "profitLoss": 1140.0,
      "profitLossPercent": 17.54,
      "allocationPercent": 26.3
    }
  ],
  "summary": {
    "totalInvested": 28972.5,
    "currentValue": 31640.0,
    "totalProfitLoss": 2667.5,
    "totalProfitLossPercent": 9.21,
    "totalAssets": 5,
    "topPerformer": {
      "symbol": "WEGE3",
      "name": "WEG ON",
      "profitLossPercent": 33.1
    },
    "worstPerformer": {
      "symbol": "VALE3",
      "name": "Vale ON",
      "profitLossPercent": -8.24
    },
    "largestAllocation": {
      "symbol": "ITUB4",
      "name": "Itaú Unibanco PN",
      "allocationPercent": 32.5
    }
  },
  "distribution": [
    {
      "symbol": "ITUB4",
      "name": "Itaú Unibanco PN",
      "type": "stock",
      "currentValue": 9450.0,
      "allocationPercent": 32.5
    }
  ]
}
```

**Tipo `PortfolioData`:**

```typescript
interface PortfolioData {
  positions: Position[]
  summary: PortfolioSummary
  distribution: PortfolioDistributionItem[]
}

interface Position {
  symbol: string
  name: string
  type: 'stock' | 'fii' | 'bdr' | 'etf' | 'fixed-income' | 'crypto'
  quantity: number
  averagePrice: number // Preço médio ponderado de compra
  investedAmount: number // quantity * averagePrice
  currentPrice: number // Preço atual de mercado
  currentValue: number // quantity * currentPrice
  profitLoss: number // currentValue - investedAmount
  profitLossPercent: number // (profitLoss / investedAmount) * 100
  allocationPercent: number // (currentValue / totalPortfolioValue) * 100
}

interface PortfolioSummary {
  totalInvested: number
  currentValue: number
  totalProfitLoss: number
  totalProfitLossPercent: number
  totalAssets: number
  topPerformer: { symbol: string; name: string; profitLossPercent: number } | null
  worstPerformer: { symbol: string; name: string; profitLossPercent: number } | null
  largestAllocation: { symbol: string; name: string; allocationPercent: number } | null
}

interface PortfolioDistributionItem {
  symbol: string
  name: string
  type: AssetType
  currentValue: number
  allocationPercent: number
}
```

**Regras de cálculo do portfolio:**

1. Buscar todas as operations do user (`tenant_id` + `user_id`)
2. Agrupar por `symbol`
3. Para cada símbolo:
   - `quantity` = soma(buys.quantity) - soma(sells.quantity)
   - Se `quantity <= 0` → **não incluir** no portfolio (posição fechada)
   - `averagePrice` = preço médio ponderado das compras: `soma(buy.quantity * buy.unitPrice) / soma(buy.quantity)`
   - `investedAmount` = `quantity * averagePrice`
   - `currentPrice` = **preço atual de mercado** (ver nota abaixo)
   - `currentValue` = `quantity * currentPrice`
   - `profitLoss` = `currentValue - investedAmount`
   - `profitLossPercent` = `(profitLoss / investedAmount) * 100`
4. `allocationPercent` = `(currentValue / soma_de_todos_currentValue) * 100`
5. `distribution` = posições ordenadas por `allocationPercent` DESC

> **Nota sobre `currentPrice`:** Para o MVP, pode-se usar o `unitPrice` da última operação de compra como proxy. Futuramente, integrar com API de cotações (B3, Alpha Vantage, etc).

---

### 8.6 Reports

**Autenticado.** Dados analíticos computados.

#### `GET /api/reports/summary`

**Query params:**
| Param | Tipo | Descrição |
|-------------|--------|--------------------------------------------|
| `period` | string | `7d`, `30d`, `3m`, `6m`, `1y`, `custom` |
| `startDate` | string | ISO date (só quando `period = custom`) |
| `endDate` | string | ISO date (só quando `period = custom`) |

**Response `200`:**

```json
{
  "summary": {
    "totalInvested": 28972.5,
    "currentValue": 31640.0,
    "totalProfitLoss": 2667.5,
    "totalProfitLossPercent": 9.21,
    "totalOperations": 6,
    "bestPerformer": {
      "symbol": "WEGE3",
      "name": "WEG ON",
      "profitLoss": 1390.0,
      "profitLossPercent": 33.1,
      "currentValue": 5590.0
    },
    "worstPerformer": {
      "symbol": "VALE3",
      "name": "Vale ON",
      "profitLoss": -840.0,
      "profitLossPercent": -8.24,
      "currentValue": 9360.0
    }
  },
  "timeSeries": [
    {
      "date": "2026-03-20",
      "investedValue": 20000.0,
      "currentValue": 21500.0
    }
  ],
  "distribution": [
    {
      "label": "stock",
      "value": 25000.0,
      "percentage": 79.05
    },
    {
      "label": "fii",
      "value": 6640.0,
      "percentage": 20.95
    }
  ],
  "operationsAggregate": {
    "totalBuys": 5,
    "totalSells": 1,
    "totalBuyVolume": 36880.0,
    "totalSellVolume": 2137.5,
    "mostNegotiatedAsset": "VALE3",
    "periodStart": "2026-03-20",
    "periodEnd": "2026-04-20"
  },
  "topGainers": [
    {
      "symbol": "WEGE3",
      "name": "WEG ON",
      "profitLoss": 1390.0,
      "profitLossPercent": 33.1,
      "currentValue": 5590.0
    }
  ],
  "topLosers": [
    {
      "symbol": "VALE3",
      "name": "Vale ON",
      "profitLoss": -840.0,
      "profitLossPercent": -8.24,
      "currentValue": 9360.0
    }
  ]
}
```

**Tipo `ReportData`:**

```typescript
interface ReportData {
  summary: ReportSummary
  timeSeries: ReportTimeSeriesPoint[]
  distribution: ReportDistributionItem[]
  operationsAggregate: ReportOperationsAggregate
  topGainers: ReportTopMover[]
  topLosers: ReportTopMover[]
}

interface ReportSummary {
  totalInvested: number
  currentValue: number
  totalProfitLoss: number
  totalProfitLossPercent: number
  totalOperations: number // Qtd de operações NO PERÍODO
  bestPerformer: ReportTopMover | null
  worstPerformer: ReportTopMover | null
}

interface ReportTimeSeriesPoint {
  date: string // YYYY-MM-DD
  investedValue: number // Valor investido acumulado até essa data
  currentValue: number // Valor atual projetado
}

interface ReportDistributionItem {
  label: string // Tipo do ativo: 'stock', 'fii', etc.
  value: number // Valor em R$
  percentage: number // % do total
}

interface ReportOperationsAggregate {
  totalBuys: number
  totalSells: number
  totalBuyVolume: number
  totalSellVolume: number
  mostNegotiatedAsset: string | null
  periodStart: string // YYYY-MM-DD
  periodEnd: string // YYYY-MM-DD
}

interface ReportTopMover {
  symbol: string
  name: string
  profitLoss: number
  profitLossPercent: number
  currentValue: number
}
```

**Regras de cálculo (detalhadas):**

1. **`summary`**: Dados do portfolio atual + count de operações dentro do período
2. **`timeSeries`**: Um ponto por dia no período. Para cada dia, somar `totalAmount` de todas as compras até aquela data → `investedValue`. `currentValue` = `investedValue * (portfolio.currentValue / portfolio.totalInvested)`
3. **`distribution`**: Agrupar posições do portfolio por `assetType`, somar `currentValue` por tipo, calcular `percentage`
4. **`operationsAggregate`**: Filtrar operações pelo range do período e agregar
5. **`topGainers`**: Posições com `profitLossPercent > 0`, top 3 por %, descendente
6. **`topLosers`**: Posições com `profitLossPercent < 0`, top 3 por %, ascendente (piores primeiro)

---

#### `GET /api/reports/export` _(futuro)_

Definido nos endpoints mas não implementado no front. Reservado para exportar CSV.

---

### 8.7 Settings

Todos **autenticados**.

#### `GET /api/settings/profile`

Retorna os settings combinados do user (profile + preferences + security + platform).

**Response `200`:**

```json
{
  "profile": {
    "name": "Admin Demo",
    "email": "admin@demo.com",
    "locale": "pt-BR",
    "currency": "BRL"
  },
  "preferences": {
    "theme": "system",
    "dateFormat": "dd/MM/yyyy",
    "currencyFormat": "BRL"
  },
  "security": {
    "canChangePassword": true
  },
  "platform": {
    "showPortfolioHighlights": true,
    "allowAIInsights": true,
    "defaultMarketView": "list"
  }
}
```

**Tipo `SettingsData`:**

```typescript
interface SettingsData {
  profile: {
    name: string
    email: string
    locale: string // 'pt-BR' | 'en-US'
    currency: string // 'BRL' | 'USD' | 'EUR'
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    dateFormat: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd'
    currencyFormat: 'BRL' | 'USD' | 'EUR'
  }
  security: {
    canChangePassword: boolean
  }
  platform: {
    showPortfolioHighlights: boolean
    allowAIInsights: boolean
    defaultMarketView: 'list' | 'grid'
  }
}
```

**Regras:**

- `profile.name` e `profile.email` vêm da tabela `users`
- `preferences` e `platform` vêm de `user_settings` (JSONB)
- `security.canChangePassword` = `true` se user tem `password_hash` (não é SSO)
- Se `user_settings` não existir, retornar valores default:
  - `theme: 'system'`, `dateFormat: 'dd/MM/yyyy'`, `currencyFormat: 'BRL'`
  - `showPortfolioHighlights: true`, `allowAIInsights: true`, `defaultMarketView: 'list'`

---

#### `PATCH /api/settings/profile`

**Request:**

```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "locale": "en-US",
  "currency": "USD"
}
```

**Response `200`:** `UserProfileSettings` atualizado.

**Regras:**

- Atualizar `name` e `email` na tabela `users`
- Atualizar `locale` e `currency` no JSONB de `user_settings.profile`
- Se email mudar, validar unicidade dentro do tenant

---

#### `PATCH /api/settings/preferences`

**Request:**

```json
{
  "theme": "dark",
  "dateFormat": "yyyy-MM-dd",
  "currencyFormat": "USD"
}
```

**Response `200`:** `UserPreferenceSettings` atualizado.

---

#### `POST /api/settings/password`

**Request:**

```json
{
  "currentPassword": "senha-atual",
  "newPassword": "nova-senha-123"
}
```

> **Nota:** O front envia `confirmPassword` também, mas é validado client-side.
> O back só recebe `currentPassword` e `newPassword`.

**Response `204`:** sem body.

**Erros:**
| Status | Quando |
|--------|---------------------------------|
| `400` | `newPassword` fraca ou inválida |
| `401` | `currentPassword` incorreta |

---

#### `PATCH /api/settings/platform`

**Request:**

```json
{
  "showPortfolioHighlights": false,
  "allowAIInsights": true,
  "defaultMarketView": "grid"
}
```

**Response `200`:** `PlatformSettings` atualizado.

**Permissão:** Apenas `admin`.

---

### 8.8 Tenant Config

#### `GET /api/tenants/:id/config`

**Público** — sem token.

**Response `200`:**

```json
{
  "id": "default",
  "name": "White Label Finance",
  "theme": {
    "colorPrimary": "#2563eb",
    "colorPrimaryForeground": "#ffffff",
    "colorSecondary": "#64748b",
    "colorSecondaryForeground": "#ffffff",
    "colorBackground": "#ffffff",
    "colorForeground": "#0f172a",
    "colorMuted": "#f8fafc",
    "colorMutedForeground": "#64748b",
    "colorBorder": "#e2e8f0",
    "logoUrl": "/logo.svg",
    "fontFamily": "Inter, system-ui, sans-serif"
  },
  "features": ["notifications", "export-csv", "portfolio", "operations", "ai-insights", "reports"],
  "appConfig": {
    "currencyCode": "BRL",
    "locale": "pt-BR",
    "supportEmail": "suporte@wlfinance.com.br"
  }
}
```

**Erros:**
| Status | Quando |
|--------|----------------------------|
| `404` | Tenant não encontrado |

---

## 9. Regras de Negócio

### 9.1 Operações → Portfolio

O portfolio é **derivado** das operações. Não existe tabela de "posições" — são calculadas:

```
Para cada symbol:
  buys  = operações do tipo 'buy'  para esse symbol
  sells = operações do tipo 'sell' para esse symbol

  quantity = Σ(buys.quantity) - Σ(sells.quantity)

  Se quantity <= 0 → posição fechada, não incluir

  averagePrice = Σ(buy.quantity × buy.unitPrice) / Σ(buy.quantity)
  investedAmount = quantity × averagePrice
```

### 9.2 Validação de Venda

Ao criar operação de `sell`:

- Calcular posição atual do symbol: `Σ(buys.quantity) - Σ(sells.quantity)`
- Se `venda.quantity > posição atual` → retornar `422`:
  ```json
  { "message": "Quantidade insuficiente. Posição atual: X unidades.", "field": "quantity" }
  ```

### 9.3 totalAmount é Server-Side

O campo `totalAmount` da operação é **sempre computado pelo servidor**:

```
totalAmount = (quantity × unitPrice) + fees
```

Nunca confiar no valor enviado pelo front.

### 9.4 Dashboard reflete Transactions

- Os dados do dashboard são derivados de `transactions` (não de `operations`)
- `balance` = somatório de receitas - despesas
- Apenas transações com `status = 'completed'` contam nos cálculos

### 9.5 Isolamento por Tenant + User

- **Transactions**: filtrar por `tenant_id` + `user_id`
- **Operations**: filtrar por `tenant_id` + `user_id`
- **Portfolio**: derivado de operations do user
- **Dashboard**: derivado de transactions do user
- **Settings**: por `tenant_id` + `user_id`

### 9.6 Reports compõe Portfolio + Operations

O endpoint de reports retorna um `ReportData` que combina:

- Dados do portfolio atual (summary, positions, distribution)
- Operações filtradas pelo período

O back **deve** computar tudo server-side em uma única query otimizada.

---

## 10. Feature Flags por Tenant

Cada tenant tem um array `features` que determina quais módulos estão disponíveis.
O front usa isso para mostrar/esconder rotas e itens do menu.

O back **deve respeitar** as feature flags:

| Feature Flag      | Endpoints protegidos                           |
| ----------------- | ---------------------------------------------- |
| `portfolio`       | `GET /portfolio/positions`                     |
| `operations`      | `GET/POST/PUT/DELETE /operations`              |
| `reports`         | `GET /reports/summary`, `GET /reports/export`  |
| `ai-insights`     | (front-only, não tem endpoint no back)         |
| `notifications`   | (front-only)                                   |
| `export-csv`      | `GET /reports/export`                          |
| `investments`     | Investments page (sem endpoint dedicado ainda) |
| `credit`          | (reservado para futuro)                        |
| `multi-account`   | (reservado para futuro)                        |
| `audit-log`       | (reservado para futuro)                        |
| `market-overview` | (reservado para futuro)                        |

Se o tenant não tem a feature, retornar `403`:

```json
{ "message": "Este recurso não está disponível para sua organização." }
```

---

## 11. Variáveis de Ambiente

```env
# ─── Server ──────────────────────────────────────────────────
PORT=3000
NODE_ENV=development

# ─── Database ────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/whitelabel

# ─── JWT ─────────────────────────────────────────────────────
JWT_SECRET=your-256-bit-secret-here
JWT_EXPIRES_IN=24h

# ─── CORS ────────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:5173

# ─── Bcrypt ──────────────────────────────────────────────────
BCRYPT_ROUNDS=12

# ─── Seed (desenvolvimento) ──────────────────────────────────
SEED_ADMIN_EMAIL=admin@demo.com
SEED_ADMIN_PASSWORD=admin123
```

---

## 12. Estrutura de Pastas Sugerida

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── main.ts                     # Bootstrap
│   ├── app.module.ts               # Root module
│   │
│   ├── common/                     # Shared infra
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── tenant-id.decorator.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   ├── role.guard.ts
│   │   │   └── feature.guard.ts
│   │   ├── interceptors/
│   │   │   └── tenant.interceptor.ts
│   │   ├── filters/
│   │   │   └── app-error.filter.ts
│   │   └── types/
│   │       └── request.d.ts        # Express Request augmentation
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts      # POST /login, /logout, GET /me
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── auth-response.dto.ts
│   │
│   ├── tenants/
│   │   ├── tenants.module.ts
│   │   ├── tenants.controller.ts   # GET /tenants/:id/config
│   │   └── tenants.service.ts
│   │
│   ├── transactions/
│   │   ├── transactions.module.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── dto/
│   │       ├── create-transaction.dto.ts
│   │       ├── update-transaction.dto.ts
│   │       └── transaction-filters.dto.ts
│   │
│   ├── operations/
│   │   ├── operations.module.ts
│   │   ├── operations.controller.ts
│   │   ├── operations.service.ts
│   │   └── dto/
│   │       ├── create-operation.dto.ts
│   │       ├── update-operation.dto.ts
│   │       └── operation-filters.dto.ts
│   │
│   ├── portfolio/
│   │   ├── portfolio.module.ts
│   │   ├── portfolio.controller.ts  # GET /portfolio/positions
│   │   └── portfolio.service.ts     # Deriva das operations
│   │
│   ├── dashboard/
│   │   ├── dashboard.module.ts
│   │   ├── dashboard.controller.ts  # GET summary, chart, recent
│   │   └── dashboard.service.ts     # Agrega das transactions
│   │
│   ├── reports/
│   │   ├── reports.module.ts
│   │   ├── reports.controller.ts
│   │   └── reports.service.ts       # Combina portfolio + operations
│   │
│   └── settings/
│       ├── settings.module.ts
│       ├── settings.controller.ts
│       ├── settings.service.ts
│       └── dto/
│           ├── update-profile.dto.ts
│           ├── update-preferences.dto.ts
│           ├── change-password.dto.ts
│           └── update-platform.dto.ts
│
├── test/
│   ├── app.e2e-spec.ts
│   └── fixtures/
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 13. Checklist de Implementação

### Fase 1 — Fundação (pré-requisito para tudo)

- [ ] Setup do projeto (NestJS + Prisma + PostgreSQL)
- [ ] Configurar variáveis de ambiente
- [ ] Criar schema Prisma com todas as tabelas
- [ ] Rodar migration inicial
- [ ] Implementar seed (tenant `default` + user `admin@demo.com`)
- [ ] Configurar CORS
- [ ] Middleware de tenant (`X-Tenant-ID` → injetar em toda query)
- [ ] Error filter global (retornando `{ message, field?, code? }`)

### Fase 2 — Auth

- [ ] `POST /auth/login` (bcrypt + JWT)
- [ ] `POST /auth/logout` (204)
- [ ] `GET /auth/me` (decodificar JWT + buscar user)
- [ ] Auth guard (validar JWT em todo request)
- [ ] Role guard (`@Roles('admin')`)
- [ ] Feature guard (`@Feature('portfolio')`)

### Fase 3 — CRUD Core

- [ ] `GET/POST/PUT/DELETE /transactions`
  - [ ] Filtros: search, type, category, dateFrom, dateTo, orderBy, orderDir
  - [ ] Validação de payload com Zod/class-validator
- [ ] `GET/POST/PUT/DELETE /operations`
  - [ ] Filtros: search, operationType, assetType, startDate, endDate, orderBy, orderDirection
  - [ ] Computar `totalAmount` server-side
  - [ ] Resolver `assetName` a partir do `symbol`
  - [ ] Validar quantidade para venda

### Fase 4 — Dados Derivados

- [ ] `GET /portfolio/positions`
  - [ ] Computar posições a partir das operations
  - [ ] Calcular summary, distribution
  - [ ] `currentPrice` (MVP: último preço de compra)
- [ ] `GET /dashboard/summary`
  - [ ] Agregar transactions por período
  - [ ] Calcular previousValue para comparação
- [ ] `GET /dashboard/chart`
  - [ ] Bucketing por período (hora/dia/semana)
- [ ] `GET /dashboard/transactions/recent`
  - [ ] Top 7 transações recentes do período

### Fase 5 — Reports & Settings

- [ ] `GET /reports/summary`
  - [ ] Combinar portfolio + operations filtradas
  - [ ] Computar timeSeries, distribution, operationsAggregate, topMovers
- [ ] `GET /settings/profile` (combinado)
- [ ] `PATCH /settings/profile`
- [ ] `PATCH /settings/preferences`
- [ ] `POST /settings/password`
- [ ] `PATCH /settings/platform` (admin only)

### Fase 6 — Tenant Config

- [ ] `GET /tenants/:id/config` (público)
- [ ] Seed do tenant `acme` com config diferente

### Fase 7 — Qualidade

- [ ] Testes unitários para services
- [ ] Testes e2e para cada endpoint
- [ ] Swagger/OpenAPI auto-generated
- [ ] Rate limiting
- [ ] Request logging
- [ ] Health check endpoint (`GET /api/health`)

---

## Apêndice A — Seed de Desenvolvimento

Para que o front funcione out-of-the-box ao apontar para o back, criar o seed com estes dados:

```typescript
// Tenant
{
  id: 'default',
  name: 'White Label Finance',
  config: { /* defaultTenantConfig completo */ }
}

// User
{
  email: 'admin@demo.com',
  password: 'admin123',  // → bcrypt hash
  name: 'Admin Demo',
  role: 'admin',
  tenantId: 'default'
}

// Transactions (8 items - ver mock do front)
// Operations (6 items - ver mock do front)
```

Os dados exatos do mock estão nos arquivos:

- `src/modules/transactions/services/transactionService.ts` → `MOCK_STORE`
- `src/modules/operations/services/operationService.ts` → `MOCK_STORE`
- `src/modules/portfolio/services/portfolioService.ts` → `MOCK_SEEDS`

---

## Apêndice B — Checklist de Compatibilidade Front↔Back

Antes de considerar o endpoint "pronto", verificar:

- [ ] Response body tem **exatamente** os mesmos nomes de campo que o type do front (camelCase)
- [ ] Datas são retornadas em ISO 8601 com timezone (`Z` ou offset)
- [ ] `amount`, `value`, `totalAmount` são **sempre números** (não strings)
- [ ] Arrays vazios retornam `[]`, não `null`
- [ ] Campos opcionais ausentes são `null` ou omitidos (não `undefined`)
- [ ] `id` é string (UUID como string, não número)
- [ ] Erros retornam `{ message: string }` no mínimo
- [ ] `201` para criação, `200` para update/read, `204` para delete/logout
- [ ] Filtro `type=all` ou `operationType=all` → não filtrar (retornar tudo)
