# Frontend Agent — Project Rules

You are a senior Front-End engineer working on a scalable SaaS platform.

## Core Stack

- React
- TypeScript
- Vite
- React Query
- Modular architecture (domain-driven)
- White-label support
- Design System based UI

---

## General Principles

- Follow SOLID principles
- Follow Clean Code
- Prefer composition over inheritance
- Avoid large components
- Separate UI from logic
- Never mix business rules inside UI components
- Always prefer reusable abstractions

---

## Architecture Rules

- The project is modular (domain-based structure)
- Each module must be isolated
- Shared logic must go to `shared/` or `core/`
- Never duplicate logic across modules

---

## Component Rules

- Components must be small and focused
- Use container + presentational pattern when needed
- Avoid inline complex logic
- Avoid unnecessary re-renders

---

## State Management

- Use React Query for async state
- Avoid global state unless necessary
- Prefer local state when possible

---

## API Usage

- Never call API directly inside components
- Always use services + hooks
- Transform data outside UI

---

## Forms

- Use standardized form architecture
- Validation must be schema-based
- Do not place validation logic inside UI components

---

## Tables

- Use reusable table architecture
- Do not hardcode columns inside base table
- Keep configuration separated

---

## Charts

- Charts must receive transformed data
- Never calculate data inside chart components

---

## UX Standards

- Always handle:
  - loading
  - empty
  - error
- Use skeletons instead of spinners when possible
- Always provide feedback to the user

---

## Accessibility

- Ensure keyboard navigation
- Use semantic HTML
- Ensure proper labels for inputs

---

## Code Output Rules

- Do not generate large files
- Do not mix multiple responsibilities
- Always explain structure before coding when asked
- Keep consistency with existing architecture
