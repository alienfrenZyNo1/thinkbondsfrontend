# Repository Guidelines

## Project Structure & Modules

- `src/app/`: Next.js App Router pages and API routes under `src/app/api/*`.
- `src/components/`: Reusable UI (shadcn/ui + custom) and forms.
- `src/lib/`: Domain utilities (auth, roles, schemas, feature flags).
- `src/tests/`: Unit tests (`src/tests/unit/*`), setup, utils, and test data.
- `src/e2e/`: Playwright end‑to‑end specs; config in `playwright.config.ts`.
- `public/`: Static assets. `docker/`: container tooling. `.husky/`: git hooks.

## Build, Test, and Dev

- `pnpm dev`: Run locally with Turbopack at `http://localhost:3000`.
- `pnpm build` / `pnpm start`: Production build and serve.
- `pnpm lint` / `pnpm lint:fix`: Lint check / auto‑fix.
- `pnpm format`: Prettier formatting.
- Unit tests: `pnpm test`, `pnpm test:unit:coverage` (V8 coverage report).
- E2E tests: `pnpm test:e2e` (CLI), `pnpm test:e2e:ui` (UI), `pnpm test:e2e:report`.

## Coding Style & Naming

- TypeScript, strict mode; 2‑space indent, semicolons, single quotes, 80 char width.
- ESLint (`.eslintrc.json`) with `@typescript-eslint` and Prettier integration.
- Component files: `PascalCase` (e.g., `MetricCard.tsx`); utils: `camelCase`.
- Test files: `*.test.ts`/`*.test.tsx` colocated in `src/tests/unit` or next to source.

## Testing Guidelines

- Frameworks: Vitest (unit, JSDOM) and Playwright (e2e). Coverage via `@vitest/coverage-v8`.
- Keep unit tests fast and isolated; mock network with MSW where applicable.
- Name tests descriptively; prefer behavior‑focused assertions.
- E2E base URL is `http://localhost:3000`; Playwright auto‑starts dev server.

## Commit & PR Guidelines

- Commits: concise, imperative, scoped (e.g., `feat(auth): add Keycloak adapter`).
- Pre‑commit runs lint‑staged via Husky; ensure `pnpm lint` and tests pass.
- PRs: clear description, link issues, include screenshots for UI changes, and note test coverage or new cases.

## Security & Configuration

- Never commit secrets. Base env from `.env.example`; use `.env.local` for dev.
- Auth via `next-auth` (Keycloak). RBAC and security helpers live in `src/lib`.
- Prefer `@/*` path alias; keep server logic in route handlers under `src/app/api/*`.
