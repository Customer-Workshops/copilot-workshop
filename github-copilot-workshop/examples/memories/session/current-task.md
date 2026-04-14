# Session Context: E-Commerce API Refactor

## Current Task
Refactoring the product catalog service to use a repository pattern and improve testability.

## Progress So Far
- [x] Extracted `ProductRepository` interface with `findById`, `findAll`, `save`, and `delete` methods
- [x] Implemented `SqlProductRepository` using the existing database connection
- [x] Updated `ProductService` to depend on `ProductRepository` instead of direct DB calls
- [ ] Write unit tests for `ProductService` using a mock repository
- [ ] Update integration tests to use the real `SqlProductRepository`
- [ ] Update the dependency injection container to wire everything together

## Key Decisions Made
- Using the **Repository pattern** (not Active Record) to keep domain logic separate from persistence
- The `Product` entity should remain a plain data object — no ORM decorators on the domain model
- Error handling: repository methods return `Result<T, Error>` instead of throwing exceptions

## Files Modified
- `src/repositories/ProductRepository.ts` — new interface
- `src/repositories/SqlProductRepository.ts` — new implementation
- `src/services/ProductService.ts` — updated to use repository

## Files Still To Update
- `src/container.ts` — dependency injection
- `tests/services/ProductService.test.ts` — unit tests
- `tests/repositories/SqlProductRepository.test.ts` — integration tests

## Notes
- The existing `ProductService` had a bug in `calculateDiscount()` — fixed as part of this refactor
- Database uses PostgreSQL with `pg` driver; do not switch to an ORM
