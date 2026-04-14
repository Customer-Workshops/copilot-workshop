---
name: pr-review
description: Review pull requests with comprehensive criteria for code quality, security, and best practices
applyTo:
  - "*.md"
  - ".github/pull_request_template.md"
---

# Pull Request Review Guidelines

When reviewing pull requests, evaluate the following aspects to ensure code quality, maintainability, and security.

## Code Quality

### Readability
- [ ] Code is self-documenting with clear variable and function names
- [ ] Complex logic includes explanatory comments
- [ ] Code follows consistent formatting and style
- [ ] No unnecessary complexity or over-engineering

### Functionality
- [ ] Code accomplishes the stated goal of the PR
- [ ] Edge cases are handled appropriately
- [ ] Error handling is present and meaningful
- [ ] No obvious bugs or logical errors

### Design Patterns
- [ ] Appropriate design patterns are used
- [ ] Code follows SOLID principles
- [ ] DRY principle is applied (no unnecessary duplication)
- [ ] Separation of concerns is maintained

## Testing

### Test Coverage
- [ ] New functionality includes unit tests
- [ ] Tests cover happy path scenarios
- [ ] Tests cover edge cases and error conditions
- [ ] Integration tests added for cross-component features

### Test Quality
- [ ] Tests are readable and well-organized
- [ ] Test names clearly describe what is being tested
- [ ] Tests are independent and don't rely on execution order
- [ ] Mocks and stubs are used appropriately

## Security

### Input Validation
- [ ] All user inputs are validated
- [ ] SQL injection protection is in place
- [ ] XSS vulnerabilities are addressed
- [ ] CSRF protection is implemented where needed

### Authentication & Authorization
- [ ] Authentication is properly implemented
- [ ] Authorization checks are in place
- [ ] Sensitive operations require appropriate permissions
- [ ] Session management is secure

### Data Protection
- [ ] Sensitive data is encrypted at rest and in transit
- [ ] No secrets or credentials in code
- [ ] Personal data handling complies with privacy requirements
- [ ] Logging doesn't expose sensitive information

## Documentation

### Code Documentation
- [ ] Public APIs have clear documentation
- [ ] Complex algorithms are explained
- [ ] Documentation is accurate and up-to-date
- [ ] Breaking changes are clearly noted

### Project Documentation
- [ ] README is updated if needed
- [ ] CHANGELOG includes new changes
- [ ] API documentation reflects changes
- [ ] Migration guides provided for breaking changes

## Performance

### Efficiency
- [ ] No obvious performance bottlenecks
- [ ] Database queries are optimized
- [ ] Caching is used where appropriate
- [ ] Resource usage is reasonable

### Scalability
- [ ] Code scales with increased load
- [ ] No hardcoded limits that could cause issues
- [ ] Async operations are used appropriately
- [ ] Memory leaks are prevented

## Maintainability

### Dependencies
- [ ] New dependencies are justified
- [ ] Dependencies are kept up-to-date
- [ ] License compatibility is verified
- [ ] No unused dependencies added

### Technical Debt
- [ ] No new technical debt introduced
- [ ] Existing technical debt addressed where possible
- [ ] TODOs have associated issues
- [ ] Deprecated APIs are avoided

## CI/CD

### Build & Tests
- [ ] All CI checks pass
- [ ] Build succeeds on all target platforms
- [ ] All tests pass
- [ ] No flaky tests introduced

### Deployment
- [ ] Database migrations are included if needed
- [ ] Environment variables documented
- [ ] Deployment process is clear
- [ ] Rollback plan exists for significant changes

## Review Checklist Summary

For each PR, provide:

1. **Summary**: Brief description of what the PR does
2. **Strengths**: What's done well
3. **Concerns**: Issues that must be addressed before merge
4. **Suggestions**: Optional improvements for consideration
5. **Verdict**: Approve, Request Changes, or Comment

## Example Review Comment

```markdown
## Review Summary

This PR adds user authentication with JWT tokens.

### Strengths
✅ Comprehensive test coverage including edge cases
✅ Clear error messages and handling
✅ Good separation of concerns

### Concerns
🔴 Tokens don't have expiration time (security issue)
🔴 Password validation is missing
🟡 Consider rate limiting for login attempts

### Suggestions
💡 Consider using bcrypt for password hashing (currently using SHA-256)
💡 Add password strength requirements documentation

### Verdict
Request Changes - please address the security concerns before merge.
```
