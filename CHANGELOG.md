# Changelog

## 0.7.0 (2025-08-29)

### Features

- Added API routes for restoring and bin management for offers, policyholders, and proposals
- Updated proposal and policyholder history pages with improved UI and functionality
- Enhanced proposal detail page with better user experience
- Updated acceptance flow component with improved error handling
- Improved side navigation component with better responsive design
- Enhanced offer form component with additional validation
- Updated authentication middleware with improved security measures
- Added comprehensive test coverage for authentication, RBAC, and proposal flows
- Updated test mocking utilities for better test reliability

## 0.6.0 (2025-08-28)

### Features

- Implemented comprehensive testing suite with unit and e2e tests
- Created unit tests for role utilities, adapters, Zod schemas, API routes, authentication, Creditsafe helpers, and feature flags
- Created e2e tests for login flow, access request, policyholder approval, proposal wizard, offer acceptance, edit history, soft delete, and RBAC
- Updated vitest.config.ts with coverage reporting configuration
- Updated playwright.config.ts with multiple browser testing configuration
- Created test utilities for mock data generation, authentication helpers, API call helpers, and DOM interaction helpers
- Added test scripts to package.json for unit test watch mode and coverage reports
- Implemented proper test coverage for critical paths, error conditions, edge cases, and role-based access control
- Added test data files and test-specific environment variables
- Implemented proper test isolation with setup and teardown functions
- Added comprehensive test documentation to README with testing instructions

## 0.5.0 (2025-08-28)

### Features

- Implemented offer/accept flow with PDF generation
- Created wholesaler interface to issue bond offers for proposals
- Implemented public acceptance page with OTP verification for Policyholder/Beneficiary
- Added bond certificate display and e-sign functionality
- Created API routes for bond PDF generation and acceptance
- Added UI components for offer creation, bond certificate display, and acceptance flow
- Implemented proper validation with Zod schemas for offers and acceptance
- Added MSW mocking for bond and offer endpoints
- Enhanced proposal detail page with offer status tracking
- Implemented security measures for token generation and OTP validation

## 0.4.0 (2025-08-28)

### Features

- Implemented role-aware dashboard with different content for each user role (Admin, Wholesaler, Agent, Broker)
- Created dashboard cards for key metrics and actions
- Implemented proper data fetching with TanStack Query throughout the application
- Updated brokers page with list/search functionality and role-based access control
- Updated policyholders page with list/search functionality and role-based access control
- Updated proposals page with list/search functionality and role-based access control
- Enhanced DataTable component with filtering, pagination, and actions
- Updated proposal detail page to display all sections: Policyholder, Contract, Beneficiary
- Updated policyholder detail page to display Creditsafe data
- Implemented 3-section wizard for new proposals with form validation using Zod schemas
- Added local draft persistence until submit for proposals
- Integrated Creditsafe search for beneficiary details
- Updated wholesaler settings page with due diligence configuration, underwriting percentages, bond limits, and automation rules
- Implemented full CRUD API routes for brokers, policyholders, proposals, and beneficiaries via DRAPI
- Created UI components: FormWizard, Skeleton, ErrorBoundary
- Added edit functionality and history tabs for authorized users
- Added status tracking and workflow actions

## 0.3.0 (2025-08-28)

### Features

- Implemented public access request flow with email and country form
- Created broker registration flow with PIN verification and full registration form
- Added Creditsafe company search with typeahead functionality
- Implemented registration API endpoints for access code, PIN verification, and submission
- Created form components with proper validation using Zod schemas
- Added UI components for company search and success messages
- Implemented comprehensive error handling for forms and API routes
- Integrated MSW mocking for registration endpoints
- Added proper validation with React Hook Form and Zod

## 0.2.0 (2025-08-28)

### Features

- Implemented complete authentication system with Keycloak via next-auth
- Configured JWT session strategy with token refresh logic
- Set up proper OIDC Authorization Code flow with PKCE
- Created /api/me endpoint to fetch Domino user data with caching
- Implemented middleware to protect routes and allow public access to specific paths
- Enhanced client-side authentication state management with custom hooks
- Added user profile component with sign in/out functionality
- Created acceptance flow component with one-time code verification
- Added protected route component for role-based access control
- Implemented Domino user data display component
- Enhanced navigation with user profile integration
- Created responsive shell layout with header, sidebar, and main content area
- Implemented role-aware navigation with collapsible sections
- Added notification system and mobile menu toggle
- Created dynamic breadcrumbs with Next.js router integration

## 0.1.0 (2025-08-28)

### Features

- Initial setup of Next.js 14 application
- Configured App Router with TypeScript
- Integrated Tailwind CSS for styling
- Installed shadcn/ui with Radix UI and lucide-react icons
- Set up next-auth with Keycloak provider
- Configured React Hook Form and Zod for form validation
- Integrated TanStack Query for data fetching and caching
- Added MSW for development API mocking
- Set up ESLint, Prettier, and Husky for code quality
- Installed Vitest for unit testing and Playwright for E2E testing
- Created Docker configuration for containerization
- Set up project structure with all required directories
