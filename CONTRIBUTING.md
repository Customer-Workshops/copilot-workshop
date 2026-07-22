# Contributing to GitHub Copilot Workshop

Thank you for your interest in contributing! 🎉 We welcome contributions of all kinds — whether you're fixing a bug, improving documentation, proposing a new feature, or helping triage issues. Every contribution helps make this workshop better for everyone learning GitHub Copilot.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Updating Documentation](#updating-documentation)
  - [Pull Requests](#pull-requests)
- [Development Setup & Workflow](#development-setup--workflow)
- [Style Guides & Commit Conventions](#style-guides--commit-conventions)
- [Review Process](#review-process)

---

## Code of Conduct

By participating in this project, you agree to uphold a welcoming and respectful community. We expect all contributors to:

- Be kind, patient, and considerate in all interactions.
- Use inclusive and professional language.
- Respect differing viewpoints and gracefully accept constructive feedback.
- Focus on what is best for the community and the learners using this workshop.
- Refrain from harassment, trolling, or any form of discriminatory behavior.

If you experience or witness unacceptable behavior, please report it by opening a confidential issue or contacting the maintainers directly.

---

## How Can I Contribute?

### Reporting Bugs

Found something broken? Help us fix it by submitting a bug report.

1. **Search existing issues** first to avoid duplicates.
2. If none exist, open a new issue using the **[🐛 Bug Report](../../issues/new?template=bug_report.yml)** template.
3. Please include:
   - A clear description of the bug.
   - Step-by-step instructions to reproduce it.
   - The expected vs. actual behavior.
   - Your environment details (OS, browser, runtime versions, etc.).
   - Screenshots or error logs if applicable.

The more detail you provide, the faster we can triage and fix the issue.

---

### Suggesting Enhancements

Have an idea to make the workshop better? We'd love to hear it!

1. **Search existing issues** to see if someone has already proposed it.
2. If not, open a new issue using the **[💡 Feature Request](../../issues/new?template=feature_request.yml)** template.
3. Please include:
   - A description of the problem your idea solves.
   - Your proposed solution or enhancement.
   - Any alternatives you've considered.
   - Additional context, mockups, or examples.

---

### Updating Documentation

Spotted a typo, outdated content, or a gap in the guides?

1. Open a new issue using the **[📖 Documentation Update](../../issues/new?template=documentation_update.yml)** template.
2. Please include:
   - A link or path to the file or section that needs updating.
   - A clear description of what is missing, wrong, or outdated.
   - Your suggested changes or replacement text.

For small, self-contained fixes (e.g., typos), you are also welcome to submit a pull request directly.

---

### Pull Requests

Ready to contribute code or content changes? Follow these steps:

1. **Fork** the repository by clicking the **Fork** button on GitHub.

2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/copilot-workshop.git
   cd copilot-workshop
   ```

3. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-descriptive-branch-name
   ```
   Use a clear, lowercase branch name that reflects your change (e.g., `fix/broken-nav-link`, `docs/update-setup-guide`).

4. **Make your changes**, keeping them focused and minimal in scope.

5. **Commit your changes** using the [Conventional Commits](#commit-message-guidelines) format:
   ```bash
   git commit -m "fix: correct broken link in setup guide"
   ```

6. **Push** your branch to your fork:
   ```bash
   git push origin feat/your-descriptive-branch-name
   ```

7. **Open a Pull Request** against the `main` branch of this repository. Fill in the PR description with:
   - A summary of the changes and their motivation.
   - A reference to any related issues (e.g., `Closes #42`).
   - Screenshots or before/after examples where relevant.

---

## Development Setup & Workflow

### Prerequisites

- **Git** installed and configured.
- **A GitHub account** with access to the repository.
- **Visual Studio Code** (recommended) or any code editor.
- A modern web browser (Chrome, Firefox, Edge, or Safari).

### Cloning the Repository

```bash
git clone https://github.com/Customer-Workshops/copilot-workshop.git
cd copilot-workshop
```

### Running the Workshop Locally

This project is a static website. No build step is required. You can serve it with any local HTTP server:

```bash
# Using Python (Python 3)
python -m http.server 8000

# Using Node.js
npx serve
```

Then open `http://localhost:8000` in your browser.

### Installing Dependencies (if applicable)

If you are working on tooling or scripts within the repository that require packages:

```bash
# For Node.js projects
npm install

# For Python projects
pip install -r requirements.txt
```

### Running Tests & Linters

Before submitting a PR, ensure your changes pass any existing checks:

```bash
# Run linter (if configured)
npm run lint

# Run tests (if configured)
npm test
```

> **Note:** If no automated tests exist for your change type (e.g., content updates), manually verify the workshop renders correctly in the browser and no broken links have been introduced.

---

## Style Guides & Commit Conventions

### Coding Standards

- Keep HTML, CSS, and JavaScript consistent with the existing file style.
- Use 2-space indentation for HTML and CSS files.
- Write descriptive, semantic HTML with appropriate ARIA attributes where needed.
- Avoid introducing new external dependencies unless absolutely necessary.
- Keep changes focused — one logical change per pull request.

### Markdown Standards

- Use ATX-style headings (`#`, `##`, `###`).
- Wrap code blocks with triple backticks and specify the language.
- Keep line lengths readable (80–120 characters).
- Use relative links when referencing files within the repository.

### Commit Message Guidelines

This project follows the **[Conventional Commits](https://www.conventionalcommits.org/)** specification. Each commit message should follow this format:

```
<type>(<optional scope>): <short description>

[optional body]

[optional footer(s)]
```

**Allowed types:**

| Type       | Description                                         |
|------------|-----------------------------------------------------|
| `feat`     | A new feature or content addition                   |
| `fix`      | A bug fix or correction                             |
| `docs`     | Documentation-only changes                          |
| `style`    | Formatting changes (whitespace, indentation)        |
| `refactor` | Code restructuring without behavior change          |
| `chore`    | Build, tooling, or dependency updates               |
| `test`     | Adding or updating tests                            |

**Examples:**

```
feat: add new exercise for Copilot Agent Mode
fix: correct broken image path in setup guide
docs: update prerequisites section in README
chore: bump Node.js version in CI workflow
```

- Keep the subject line under **50 characters**.
- Use the **imperative mood** ("add", "fix", "update" — not "added" or "fixes").
- Reference related issues in the footer: `Closes #12` or `Related to #34`.

---

## Review Process

After submitting a pull request, here's what to expect:

1. **Automated Checks:** CI checks (if configured) will run automatically against your PR. Ensure all checks pass before requesting a review.

2. **Maintainer Review:** A maintainer will review your PR, typically within a few business days. They may:
   - Approve and merge it directly.
   - Request changes with inline comments or suggestions.
   - Ask clarifying questions via PR comments.

3. **Addressing Feedback:** If changes are requested:
   - Push additional commits to your branch — the PR will update automatically.
   - Respond to review comments to let maintainers know what was addressed.
   - Avoid force-pushing after a review has started, as it makes it harder to track changes.

4. **Merge Criteria:** A PR is ready to merge when:
   - All CI checks pass.
   - At least one maintainer has approved the changes.
   - All review comments have been resolved.
   - The branch is up to date with `main`.

5. **After Merge:** Your contribution will be credited in the commit history. Thank you for helping improve the GitHub Copilot Workshop! 🚀

---

We appreciate every contribution, big or small. If you have any questions, feel free to open an issue or start a discussion. Happy contributing!
