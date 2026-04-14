---
name: api-docs
description: Generate comprehensive API documentation in a consistent format
applyTo:
  - "src/api/**/*.js"
  - "src/api/**/*.ts"
  - "api/**/*.js"
  - "api/**/*.ts"
  - "routes/**/*.js"
  - "routes/**/*.ts"
  - "controllers/**/*.js"
  - "controllers/**/*.ts"
---

# API Documentation Guidelines

When documenting API endpoints and functions, follow this comprehensive format to ensure clarity and consistency.

## Function/Method Documentation

### Format

```javascript
/**
 * Brief one-line description of what the function does.
 *
 * More detailed description if needed, explaining the purpose,
 * behavior, and any important implementation details.
 *
 * @param {Type} paramName - Description of the parameter
 * @param {Type} [optionalParam] - Description of optional parameter (include default value if applicable)
 * @returns {Type} Description of what is returned
 * @throws {ErrorType} Description of when this error is thrown
 *
 * @example
 * // Example usage
 * const result = functionName(param1, param2);
 * console.log(result); // Expected output
 */
```

### Example: Function Documentation

```javascript
/**
 * Creates a new user account with the provided information.
 *
 * Validates the user data, hashes the password, and stores the user
 * in the database. Sends a verification email upon successful creation.
 *
 * @param {Object} userData - The user information
 * @param {string} userData.email - User's email address (must be unique)
 * @param {string} userData.password - User's password (min 8 characters)
 * @param {string} userData.name - User's full name
 * @returns {Promise<User>} The created user object (without password)
 * @throws {ValidationError} If userData is invalid or email already exists
 * @throws {DatabaseError} If database operation fails
 *
 * @example
 * // Create a new user
 * const user = await createUser({
 *   email: 'john@example.com',
 *   password: 'securePass123',
 *   name: 'John Doe'
 * });
 * console.log(user.id); // "usr_abc123"
 */
async function createUser(userData) {
  // Implementation...
}
```

## REST API Endpoint Documentation

### Format

For each API endpoint, document:

1. **Endpoint**: HTTP method and path
2. **Description**: What the endpoint does
3. **Authentication**: Required authentication/authorization
4. **Request**: Parameters, headers, body
5. **Response**: Success and error responses with status codes
6. **Examples**: Request and response examples

### Example: REST API Documentation

```javascript
/**
 * @api {post} /api/v1/users Create User
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new user account.
 *
 * @apiPermission none
 *
 * @apiHeader {String} Content-Type application/json
 *
 * @apiBody {String} email User's email address (must be unique)
 * @apiBody {String} password User's password (minimum 8 characters)
 * @apiBody {String} name User's full name
 * @apiBody {String} [role=user] User's role (admin, user)
 *
 * @apiSuccess {String} id Unique user ID
 * @apiSuccess {String} email User's email address
 * @apiSuccess {String} name User's full name
 * @apiSuccess {String} role User's role
 * @apiSuccess {Date} createdAt Account creation timestamp
 *
 * @apiSuccessExample {json} Success Response (201 Created):
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "usr_abc123",
 *       "email": "john@example.com",
 *       "name": "John Doe",
 *       "role": "user",
 *       "createdAt": "2024-01-15T10:30:00Z"
 *     }
 *
 * @apiError {String} error Error message
 * @apiError {String} [field] Field that caused the error
 *
 * @apiErrorExample {json} Validation Error (400 Bad Request):
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Email already exists",
 *       "field": "email"
 *     }
 *
 * @apiErrorExample {json} Server Error (500 Internal Server Error):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Failed to create user"
 *     }
 *
 * @example
 * // Using fetch
 * const response = await fetch('/api/v1/users', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'john@example.com',
 *     password: 'securePass123',
 *     name: 'John Doe'
 *   })
 * });
 * const user = await response.json();
 *
 * @example
 * // Using curl
 * curl -X POST https://api.example.com/api/v1/users \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "email": "john@example.com",
 *     "password": "securePass123",
 *     "name": "John Doe"
 *   }'
 */
```

## Markdown API Documentation

When documenting APIs in markdown files:

```markdown
## POST /api/v1/users

Creates a new user account.

### Authentication
No authentication required.

### Request Headers
| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address (must be unique) |
| password | string | Yes | User's password (minimum 8 characters) |
| name | string | Yes | User's full name |
| role | string | No | User's role (default: "user") |

### Success Response (201 Created)
```json
{
  "id": "usr_abc123",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Error Responses

**400 Bad Request** - Validation error
```json
{
  "error": "Email already exists",
  "field": "email"
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "Failed to create user"
}
```

### Example Request
```bash
curl -X POST https://api.example.com/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123",
    "name": "John Doe"
  }'
```
```

## Key Documentation Elements

Always include:

1. **Clear Description**: One-sentence summary + detailed explanation
2. **Parameter Types**: Specify exact types (string, number, object, etc.)
3. **Required vs Optional**: Clearly mark optional parameters with `[brackets]` or explicit notation
4. **Default Values**: Document default values for optional parameters
5. **Constraints**: Min/max values, formats, validation rules
6. **Return Values**: Complete structure of returned data
7. **Error Cases**: All possible errors with status codes
8. **Examples**: Real, working examples that can be copy-pasted
9. **Side Effects**: Document any state changes or side effects
10. **Performance Notes**: Mention if operation is expensive or async

## Best Practices

- Keep documentation close to the code
- Update docs when code changes
- Use consistent terminology
- Include both success and error examples
- Document breaking changes clearly
- Version your API documentation
- Test your examples to ensure they work
- Link to related endpoints/functions
