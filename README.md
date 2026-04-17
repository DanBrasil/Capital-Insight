# FinanceOS — Plataforma White Label de Monitoramento Financeiro e Investimentos

Aplicação front-end SaaS multi-tenant construída com React, TypeScript e Vite. Combina gestão financeira operacional com monitoramento de ativos e análise de carteira, servindo como base reutilizável para múltiplos clientes via arquitetura white-label.

---

## Stack

| Camada          | Tecnologia                               |
| --------------- | ---------------------------------------- |
| Framework       | React 19 + TypeScript 6                  |
| Build           | Vite 8                                   |
| Estilização     | Tailwind CSS v4 (tokens via `@theme {}`) |
| Roteamento      | React Router v6                          |
| Estado servidor | TanStack React Query v5                  |
| Estado global   | Zustand v5                               |
| HTTP            | Axios v1                                 |
| Linting         | ESLint flat config + TypeScript ESLint   |
| Formatação      | Prettier                                 |

---

## Arquitetura

O projeto segue os princípios **SOLID**, **Clean Code** e separação estrita de responsabilidades.

### Estrutura de pastas

```
src/
├── components/          # Design System global (ui, form, feedback, layout, charts)
├── modules/             # Domínios de negócio — cada módulo é autocontido
│   ├── auth/
│   ├── dashboard/
│   ├── transactions/
│   ├── market-overview/ # (em desenvolvimento)
│   ├── portfolio/       # (em desenvolvimento)
│   ├── operations/      # (em desenvolvimento)
│   └── ai-insights/     # (em desenvolvimento)
├── tenants/             # Core multi-tenant: tipos, registry, provider, hooks
├── services/api/        # Camada HTTP: cliente Axios, erros tipados, endpoints
├── router/              # AppRouter, ProtectedRoute, rotas constants
├── styles/tokens/       # Design tokens CSS via @theme {}
├── pages/               # Páginas raiz (LoginPage, NotFoundPage, placeholders)
├── hooks/               # Hooks globais (useNavigation, usePageTitle)
└── main.tsx             # QueryClientProvider → TenantProvider → AppRouter
```

### Padrão por módulo

Cada módulo segue a mesma convenção:

```
modules/<domain>/
  types/index.ts              # Entidades, payloads e enums do domínio
  services/<domain>Service.ts # Funções async puras — sem React
  hooks/use<Domain>.ts        # useQuery / useMutation
  components/
    <Domain>View.tsx          # Componente orquestrador
    <SubComponents>.tsx       # Componentes puros e focados
  index.ts                    # Barrel export público do módulo
```

---

## Pilares do produto

### Gestão financeira

- Dashboard com métricas por período
- Transações com CRUD completo
- Relatórios _(planejado)_

### Mercado e investimentos

- Visão geral do mercado e watchlist
- Carteira simulada com cálculo de P&L
- Histórico de operações de compra e venda
- Insights automáticos descritivos via IA

> **Nota:** O módulo de IA produz apenas resumos textuais e análise descritiva. Não representa consultoria financeira, recomendação de compra ou venda, nem promessa de retorno.

---

## Multi-tenant (White Label)

Cada tenant tem sua própria configuração em `src/tenants/registry.ts`:

```typescript
// Registrar um novo tenant:
tenantRegistry.register('meu-cliente', meuClienteConfig)
```

A configuração define:

- **Tema visual** — paleta de cores injetada como CSS vars em runtime
- **Feature flags** — quais módulos estão habilitados
- **App config** — moeda, locale, e-mail de suporte

```typescript
type FeatureFlag =
  | 'reports'
  | 'investments'
  | 'credit'
  | 'notifications'
  | 'multi-account'
  | 'export-csv'
  | 'audit-log'
  | 'market-overview'
  | 'portfolio'
  | 'operations'
  | 'ai-insights'
```

Usar features condicionalmente nos componentes:

```tsx
<FeatureGate feature="ai-insights">
  <AiInsightsPanel />
</FeatureGate>
```

---

## API Layer

Toda comunicação HTTP passa por `src/services/api/`:

```
client.ts      # Instância Axios: timeout 15s, Bearer token, X-Tenant-ID
errors.ts      # AppError + parseApiError — shape único para todos os erros
constants.ts   # ENDPOINTS por domínio + QUERY_KEYS factory functions
index.ts       # Barrel export
```

O interceptor de 401 despacha um `CustomEvent('auth:unauthorized')` em vez de redirecionar diretamente — o `AuthProvider` escuta e trata o logout via React Router.

Erros são normalizados para `AppError` uma única vez no interceptor:

```typescript
interface AppError {
  message: string // legível, em português
  status: number // HTTP status code
  code: ApiErrorCode // 'UNAUTHORIZED' | 'NOT_FOUND' | 'NETWORK_ERROR' | ...
  field?: string // presente em erros de validação por campo
}
```

---

## Autenticação

- **Credenciais DEV:** `admin@demo.com` / `admin123`
- Token armazenado via `src/modules/auth/services/sessionStorage.ts` — único arquivo que toca `localStorage`
- `AuthProvider` usa `useReducer` com `AuthAction` union — sem mutações diretas de estado
- Sessão restaurada no mount via `fetchCurrentUser()` — valida o token antes de autenticar

---

## Design System

Componentes globais em `src/components/`, organizados por categoria:

| Categoria   | Componentes                                             |
| ----------- | ------------------------------------------------------- |
| `ui/`       | Button, Badge, Card, Spinner, Heading, Text             |
| `form/`     | Input, TextArea, Select, Checkbox, Radio, Switch        |
| `feedback/` | Modal, Tooltip                                          |
| `layout/`   | Container                                               |
| `charts/`   | BarChart (SVG puro) — LineChart e DonutChart planejados |

Tokens de design em `src/styles/tokens/index.css`:

```css
@theme {
  --color-primary: #2563eb;
  --color-success: #16a34a;
  --color-error: #dc2626;
  /* ... */
}
```

As classes utilitárias (`bg-primary`, `text-foreground`) são geradas automaticamente pelo Tailwind v4.

---

## Desenvolvimento

### Pré-requisitos

- Node.js 20+
- npm 10+

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Copie `.env.example` e ajuste:

```bash
cp .env.example .env
```

| Variável            | Descrição          | Padrão    |
| ------------------- | ------------------ | --------- |
| `VITE_API_BASE_URL` | URL base da API    | `/api`    |
| `VITE_TENANT_ID`    | ID do tenant ativo | `default` |

### Comandos

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção (tsc + vite)
npm run preview    # Preview do build
npm run lint       # Verificar erros de lint
npm run lint:fix   # Corrigir erros de lint automaticamente
npm run format     # Formatar código com Prettier
```

---

## Convenções

- **Imports** sempre via alias `@/` — nunca caminhos relativos longos
- **Mocks em DEV** — cada service retorna dados mockados quando `import.meta.env.DEV` é `true`, antes de qualquer chamada HTTP
- **Sem HTTP em componentes** — componentes só consomem hooks; hooks consomem services; services conhecem o Axios
- **QueryKeys centralizados** — `QUERY_KEYS.transactionsList(filters)` — sem strings duplicadas
- **Sem `any`** — configuração TypeScript strict + ESLint `no-explicit-any`
- **Sem `console.log`** — ESLint `no-console` ativado

---

## Módulos — Status

| Módulo              | Status                |
| ------------------- | --------------------- |
| Design System base  | ✅ Concluído          |
| Multi-tenant core   | ✅ Concluído          |
| Layout Shell + Auth | ✅ Concluído          |
| API Layer           | ✅ Concluído          |
| `dashboard`         | ✅ Concluído          |
| `transactions`      | ✅ Concluído          |
| `market-overview`   | 🔄 Em desenvolvimento |
| `portfolio`         | ⬜ Planejado          |
| `operations`        | ⬜ Planejado          |
| `ai-insights`       | ⬜ Planejado          |
| `reports`           | ⬜ Planejado          |

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
