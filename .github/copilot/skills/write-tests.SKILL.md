---
name: write-tests
description: Write comprehensive unit tests following best practices
applyTo:
  - "**/*.test.js"
  - "**/*.test.ts"
  - "**/*.spec.js"
  - "**/*.spec.ts"
---

# Writing Unit Tests

When writing unit tests, follow these guidelines to ensure comprehensive and maintainable test coverage.

## Naming Convention

Use descriptive test names that explain what is being tested and the expected outcome:

- Format: `it('should [expected behavior] when [condition]', ...)`
- Examples:
  - `it('should create a new user when valid data is provided', ...)`
  - `it('should throw an error when email is missing', ...)`
  - `it('should return null when user is not found', ...)`

## AAA Pattern

Structure all tests using the Arrange, Act, Assert pattern:

1. **Arrange**: Set up test data and dependencies
2. **Act**: Execute the code being tested
3. **Assert**: Verify the expected outcome

```javascript
describe('UserService', () => {
  it('should create a new user when valid data is provided', async () => {
    // Arrange
    const userData = { name: 'John Doe', email: 'john@example.com' };
    const mockDb = { save: jest.fn().mockResolvedValue(userData) };
    const service = new UserService(mockDb);

    // Act
    const result = await service.createUser(userData);

    // Assert
    expect(result).toEqual(userData);
    expect(mockDb.save).toHaveBeenCalledWith(userData);
  });
});
```

## Test Coverage

Write tests for all critical scenarios:

- **Happy path**: Normal, expected usage
- **Edge cases**: Boundary conditions, empty inputs, maximum values
- **Error handling**: Invalid inputs, exceptions, failed operations
- **State changes**: Verify side effects and state transitions

## Mocking

Mock external dependencies to keep tests isolated and fast:

- Mock database calls
- Mock API requests
- Mock file system operations
- Mock external services
- Use dependency injection to make mocking easier

```javascript
// Good: Using mocks for external dependencies
const mockUserRepository = {
  findById: jest.fn().mockResolvedValue(mockUser),
  save: jest.fn().mockResolvedValue(savedUser)
};
```

## Assertions

Use specific, clear assertions that make test failures easy to diagnose:

- Use `toBe()` for primitive values
- Use `toEqual()` for objects and arrays
- Use `toThrow()` for error cases
- Include descriptive error messages when helpful

```javascript
// Good: Specific assertions
expect(result.id).toBe(123);
expect(result.name).toBe('John Doe');
expect(mockDb.save).toHaveBeenCalledTimes(1);
expect(mockDb.save).toHaveBeenCalledWith(userData);

// Avoid: Generic or vague assertions
expect(result).toBeTruthy();
```

## Test Organization

Organize tests logically:

- Group related tests using `describe` blocks
- One assertion per test when possible
- Keep tests independent (no shared state)
- Run tests in any order

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with valid data', ...);
    it('should throw an error with invalid email', ...);
  });

  describe('deleteUser', () => {
    it('should delete an existing user', ...);
    it('should throw an error for non-existent user', ...);
  });
});
```

## Performance

Keep tests fast:

- Avoid real network calls
- Avoid real database operations
- Use in-memory databases for integration tests
- Run expensive tests separately

## Best Practices Summary

- Write tests before fixing bugs (TDD approach)
- Keep tests simple and readable
- Test behavior, not implementation
- Update tests when requirements change
- Aim for high coverage but prioritize critical paths
