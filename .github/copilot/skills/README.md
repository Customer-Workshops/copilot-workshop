# Copilot Skills Examples

This directory contains example `.SKILL.md` files that demonstrate how to create custom agent skills for GitHub Copilot Chat in VS Code.

## What are Skills?

Skills are instructions stored in `.SKILL.md` files that teach Copilot how to handle specific tasks or workflows. When you ask Copilot a question, it automatically detects which skills are relevant and uses them to provide more tailored, domain-specific responses.

## Available Example Skills

### 1. write-tests.SKILL.md
Guides Copilot to write comprehensive unit tests following best practices including:
- AAA pattern (Arrange, Act, Assert)
- Descriptive test naming conventions
- Mocking external dependencies
- Comprehensive coverage of happy paths and edge cases

**Applies to**: `**/*.test.js`, `**/*.test.ts`, `**/*.spec.js`, `**/*.spec.ts`

### 2. pr-review.SKILL.md
Guides Copilot to review pull requests with specific criteria including:
- Code quality and readability checks
- Test coverage verification
- Security considerations
- Documentation requirements
- Performance and scalability review

**Applies to**: `*.md`, `.github/pull_request_template.md`

### 3. api-docs.SKILL.md
Guides Copilot to generate comprehensive API documentation including:
- JSDoc format for functions
- REST API endpoint documentation
- Request/response examples
- Error case documentation
- Markdown documentation format

**Applies to**: `src/api/**/*.{js,ts}`, `api/**/*.{js,ts}`, `routes/**/*.{js,ts}`, `controllers/**/*.{js,ts}`

## How to Use These Skills

1. **In VS Code**: These skills are automatically loaded when you open this repository in VS Code with the GitHub Copilot Chat extension
2. **Test a Skill**: Open a file that matches the skill's `applyTo` pattern and ask Copilot a relevant question
3. **Customize**: Copy and modify these skills to match your team's specific conventions and requirements

## Creating Your Own Skills

To create a new skill:

1. Create a new file in this directory with the `.SKILL.md` extension
2. Add YAML front matter with `name`, `description`, and `applyTo` patterns:
   ```yaml
   ---
   name: your-skill-name
   description: Brief description of what this skill does
   applyTo:
     - "**/*.js"
     - "**/*.ts"
   ---
   ```
3. Write clear instructions and examples in the body of the file
4. Test the skill by working with files that match the `applyTo` patterns

## Best Practices

- **Be Specific**: Provide concrete examples and clear guidelines
- **Keep Focused**: Each skill should address one specific task
- **Use Examples**: Show Copilot exactly what patterns you expect
- **Scope Appropriately**: Use `applyTo` patterns to ensure skills activate at the right time
- **Version Control**: Check skills into your repository so your whole team benefits

## Learn More

Complete the **Path 3: Extended Capabilities** workshop to learn more about Agent Skills and other advanced Copilot features:
- [Workshop Home](../../index.html)
- [Extended Capabilities](../../github-copilot-workshop/extended-capabilities.html)

## Resources

- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [VS Code Copilot Chat Documentation](https://code.visualstudio.com/docs/copilot/copilot-chat)
- [Creating Custom Instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/creating-custom-instructions-for-github-copilot)
