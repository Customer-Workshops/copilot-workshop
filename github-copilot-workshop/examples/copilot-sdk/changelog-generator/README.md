# Changelog Generator - Copilot Extension

A domain-specific GitHub Copilot Extension that generates changelogs from GitHub repositories by analyzing commit history between tags or refs.

## Features

- Generate changelogs between two git tags
- Generate changelogs since a specific tag
- Generate recent commit changelog
- Categorize commits by type (Features, Bug Fixes, Other)
- Stream responses in real-time
- Works with public and private repositories

## Prerequisites

- Python 3.9 or higher
- GitHub Personal Access Token with `repo` scope
- A GitHub App with Copilot permissions
- ngrok (for local testing)

## Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   export GITHUB_TOKEN="your-github-personal-access-token"
   ```

   To create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope
   - Copy and save the token

## Running Locally

1. Start the server:
   ```bash
   python app.py
   ```

2. In another terminal, expose with ngrok:
   ```bash
   ngrok http 5001
   ```

3. Configure your GitHub App:
   - Set agent URL to: `https://your-ngrok-url.ngrok.io/agent`
   - Install the app to your account/organization

## Usage Examples

In Copilot Chat, invoke the extension:

### Generate changelog between tags
```
@changelog-generator generate changelog for octocat/Hello-World from v1.0.0 to v2.0.0
```

### Generate changelog since a tag
```
@changelog-generator generate changelog for microsoft/vscode since v1.85.0
```

### Generate recent changelog
```
@changelog-generator generate changelog for facebook/react
```

### Get help
```
@changelog-generator help
```

## How It Works

1. **Parse Request** — Extracts repository name and version tags from user message
2. **Fetch Commits** — Uses GitHub API to get commits between tags
3. **Categorize** — Groups commits by type based on keywords:
   - Features: `feat`, `feature`, `add`, `new`
   - Bug Fixes: `fix`, `bug`, `patch`
   - Other: Everything else
4. **Format** — Creates a markdown changelog with sections
5. **Stream** — Sends the changelog back via Server-Sent Events

## Project Structure

```
changelog-generator/
├── app.py              # Main application
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Response Format

The extension generates a markdown changelog:

```markdown
# Changelog: v1.0.0 → v2.0.0

**Repository:** owner/repo
**Generated:** 2024-01-15 10:30:00

## ✨ Features
- Add user authentication (abc1234)
- Add dark mode support (def5678)

## 🐛 Bug Fixes
- Fix memory leak in parser (ghi9012)
- Fix login redirect issue (jkl3456)

## 📝 Other Changes
- Update documentation (mno7890)
- Refactor tests (pqr1234)

**Total commits:** 6
```

## Customization Ideas

### Add More Commit Categories

```python
# In generate_changelog function
breaking_changes = []
docs = []
tests = []

for commit in commits:
    message = commit.commit.message
    if 'BREAKING' in message or message.startswith('!'):
        breaking_changes.append(...)
    elif 'docs' in message.lower():
        docs.append(...)
    elif 'test' in message.lower():
        tests.append(...)
```

### Filter by Author

```python
def generate_changelog(repo_name, from_tag, to_tag, author=None):
    commits = repo.compare(from_tag, to_tag).commits
    if author:
        commits = [c for c in commits if c.author.login == author]
```

### Add Pull Request Links

```python
# Extract PR numbers from commit messages
import re
pr_pattern = r'#(\d+)'
matches = re.findall(pr_pattern, message)
if matches:
    pr_num = matches[0]
    message += f" [PR#{pr_num}](https://github.com/{repo_name}/pull/{pr_num})"
```

### Support Conventional Commits

```python
# Parse conventional commit format: type(scope): message
pattern = r'^(\w+)(?:\(([^)]+)\))?: (.+)$'
match = re.match(pattern, message)
if match:
    commit_type, scope, description = match.groups()
    # Categorize by commit_type
```

## Advanced Features

### Add Caching

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def generate_changelog(repo_name, from_tag, to_tag):
    # Cache results to avoid repeated API calls
    pass
```

### Support Private Repositories

Already supported! Just ensure your GITHUB_TOKEN has access to the private repository.

### Add Statistics

```python
# Calculate statistics
total_additions = sum(c.stats.additions for c in commits)
total_deletions = sum(c.stats.deletions for c in commits)
contributors = set(c.author.login for c in commits if c.author)

changelog.append(f"\n## 📊 Statistics\n")
changelog.append(f"- Lines added: +{total_additions}")
changelog.append(f"- Lines removed: -{total_deletions}")
changelog.append(f"- Contributors: {len(contributors)}")
```

## Deployment

Deploy to make it accessible without ngrok:

### Heroku
```bash
heroku create my-changelog-generator
git push heroku main
```

### Railway
```bash
railway up
```

### Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
ENV PORT=5001
CMD ["python", "app.py"]
```

## Security Considerations

1. **Token Storage** — Store GITHUB_TOKEN in environment variables, never commit it
2. **Rate Limiting** — GitHub API has rate limits (5000 requests/hour for authenticated requests)
3. **Input Validation** — Validate repository names to prevent injection attacks
4. **Private Data** — Be cautious with private repository data in changelogs

## Troubleshooting

### "API rate limit exceeded"
- You've hit GitHub's rate limit
- Wait an hour or use a different token
- Implement caching to reduce API calls

### "Not Found" error
- Repository doesn't exist or is private
- GITHUB_TOKEN doesn't have access
- Check repository name format: `owner/repo`

### Tags not found
- Ensure tags exist: `git tag` in the repository
- Use correct tag format (e.g., `v1.0.0` not `1.0.0`)

## Resources

- [PyGithub Documentation](https://pygithub.readthedocs.io/)
- [GitHub REST API](https://docs.github.com/rest)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## Ideas for Further Development

- Add filtering by date range
- Support for monorepos (filter by path)
- Generate release notes format
- Export to different formats (HTML, PDF)
- Integration with release management tools
- Automatic PR creation with generated changelog
- Support for multiple repositories at once
- Interactive mode to edit changelog before publishing
