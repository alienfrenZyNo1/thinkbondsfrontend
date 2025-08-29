# Next.js 14 Application

This is a Next.js 14 application with the following features:

- App Router
- TypeScript
- Tailwind CSS
- shadcn/ui with Radix UI and lucide-react icons
- next-auth with Keycloak provider
- React Hook Form and Zod for forms/validation
- TanStack Query for data fetching & caching
- MSW (Mock Service Worker) for dev-only API mocks
- ESLint + Prettier + Husky (pre-commit lint)
- Vitest for unit tests and Playwright for e2e tests

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Authentication

- Keycloak integration via next-auth

### UI Components

- Pre-built shadcn/ui components
- Custom form components with validation

### Data Fetching

- TanStack Query for server state management
- MSW for API mocking in development

### Testing

- Unit tests with Vitest
- E2E tests with Playwright

### Code Quality

- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks

## Docker

To build and run the application in Docker:

```bash
docker build -t nextjs-app .
docker run -p 3000:3000 nextjs-app
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Then update the values in `.env.local` with your actual configuration.

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
pnpm test
```

Run unit tests in watch mode:

```bash
pnpm test:unit:watch
```

Run unit tests with coverage report:

```bash
pnpm test:unit:coverage
```

### E2E Tests

Run E2E tests with Playwright:

```bash
pnpm test:e2e
```

Run E2E tests with UI:

```bash
pnpm test:e2e:ui
```

View E2E test report:

```bash
pnpm test:e2e:report
```

### Test Structure

- Unit tests are located in `src/tests/unit/`
- E2E tests are located in `src/e2e/`
- Test utilities are in `src/tests/utils/`
- Test data is in `src/tests/test-data.ts`
- Test environment variables are in `src/tests/test.env`

### Running Tests

To run all tests:

```bash
pnpm test        # Run unit tests
pnpm test:e2e    # Run E2E tests
```

### Test Coverage

Unit tests include coverage reports. Run `pnpm test:unit:coverage` to generate a coverage report.

### Writing Tests

- Unit tests should focus on individual functions and components
- E2E tests should cover user flows and integration points
- Use the test utilities in `src/tests/utils/` for common testing patterns
- Mock external dependencies appropriately
- Test both happy paths and error conditions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
