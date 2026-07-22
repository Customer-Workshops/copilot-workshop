# Repository Conventions

## Project Overview
E-commerce platform built with Node.js (TypeScript) backend and React frontend.
Monorepo managed with npm workspaces.

## Technology Stack
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.x (strict mode enabled)
- **Backend framework**: Express 4
- **Database**: PostgreSQL 16 with `pg` driver (no ORM)
- **Frontend**: React 18 with Vite
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with `@typescript-eslint` ruleset
- **Formatting**: Prettier (2-space indent, single quotes, trailing commas)

## Naming Conventions
- **Files**: `kebab-case.ts` for all source files
- **Classes**: `PascalCase`
- **Interfaces**: `PascalCase` prefixed with `I` (e.g., `IProductRepository`)
- **Functions and variables**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Database tables**: `snake_case` (e.g., `product_catalog`)
- **API routes**: `kebab-case` (e.g., `/api/product-catalog`)

## Project Structure
```
packages/
  api/          # Express backend
    src/
      controllers/   # Route handlers
      services/      # Business logic
      repositories/  # Data access
      models/        # Domain types
    tests/
  web/          # React frontend
    src/
      components/
      hooks/
      pages/
    tests/
  shared/       # Shared types and utilities
```

## Testing Requirements
- All new features must include unit tests
- Unit tests live next to source files in `__tests__/` directories
- Integration tests go in the top-level `tests/` directory
- Minimum coverage: 80% for new code
- Run tests with: `npm test` (all packages) or `npm test -w packages/api` (single package)

## Build Commands
```bash
npm run build        # Build all packages
npm run dev          # Start development servers (API + frontend with hot reload)
npm test             # Run all tests
npm run lint         # Lint all packages
npm run format       # Format all files with Prettier
```

## Git Conventions
- Branch naming: `feature/short-description`, `fix/short-description`, `chore/short-description`
- Commit messages: imperative mood, present tense (e.g., "Add product search endpoint")
- PRs require at least one approval and passing CI before merge
- Squash commits when merging feature branches
