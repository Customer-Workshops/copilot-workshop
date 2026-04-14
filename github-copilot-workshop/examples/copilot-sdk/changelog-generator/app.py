import os
import json
import time
from datetime import datetime
from flask import Flask, request, Response
from github import Github

app = Flask(__name__)

# GitHub credentials
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')


def parse_changelog_request(message):
    """
    Parse the user's message to extract repository and version range
    Example: "generate changelog for owner/repo from v1.0.0 to v2.0.0"
    """
    parts = message.lower().split()

    # Simple parsing - in production, use more robust NLP
    repo_name = None
    from_tag = None
    to_tag = None

    for i, part in enumerate(parts):
        if '/' in part and not part.startswith('http'):
            repo_name = part
        elif part.startswith('v') or part.replace('.', '').isdigit():
            if from_tag is None:
                from_tag = part
            else:
                to_tag = part
        elif part in ['from', 'since'] and i + 1 < len(parts):
            from_tag = parts[i + 1]
        elif part in ['to', 'until'] and i + 1 < len(parts):
            to_tag = parts[i + 1]

    return repo_name, from_tag, to_tag


def generate_changelog(repo_name, from_tag, to_tag):
    """
    Generate a changelog by fetching commits between two tags
    """
    if not GITHUB_TOKEN:
        return "Error: GITHUB_TOKEN not configured. Please set the GITHUB_TOKEN environment variable."

    try:
        g = Github(GITHUB_TOKEN)
        repo = g.get_repo(repo_name)

        # Get commits
        if from_tag and to_tag:
            commits = repo.compare(from_tag, to_tag).commits
            title = f"Changelog: {from_tag} → {to_tag}"
        elif from_tag:
            commits = repo.get_commits(sha=from_tag)
            commits = list(commits[:50])  # Limit to 50 commits
            title = f"Changelog since {from_tag}"
        else:
            commits = list(repo.get_commits()[:50])
            title = "Recent Changelog (last 50 commits)"

        # Group commits by type
        features = []
        fixes = []
        other = []

        for commit in commits:
            message = commit.commit.message.split('\n')[0]  # First line only
            message_lower = message.lower()

            if any(word in message_lower for word in ['feat', 'feature', 'add', 'new']):
                features.append(f"- {message} ({commit.sha[:7]})")
            elif any(word in message_lower for word in ['fix', 'bug', 'patch']):
                fixes.append(f"- {message} ({commit.sha[:7]})")
            else:
                other.append(f"- {message} ({commit.sha[:7]})")

        # Build changelog
        changelog = [f"# {title}\n"]
        changelog.append(f"**Repository:** {repo_name}\n")
        changelog.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

        if features:
            changelog.append("\n## ✨ Features\n")
            changelog.extend(features)

        if fixes:
            changelog.append("\n## 🐛 Bug Fixes\n")
            changelog.extend(fixes)

        if other:
            changelog.append("\n## 📝 Other Changes\n")
            changelog.extend(other)

        changelog.append(f"\n**Total commits:** {len(commits)}")

        return '\n'.join(changelog)

    except Exception as e:
        return f"Error generating changelog: {str(e)}"


def stream_response(text):
    """
    Stream a response back to Copilot using Server-Sent Events
    """
    # Split into lines and stream them
    lines = text.split('\n')

    for line in lines:
        chunk = {
            "choices": [{
                "delta": {"content": line + '\n'},
                "finish_reason": None
            }]
        }

        yield f"data: {json.dumps(chunk)}\n\n"
        time.sleep(0.03)

    # Send final chunk
    final_chunk = {
        "choices": [{
            "delta": {},
            "finish_reason": "stop"
        }]
    }

    yield f"data: {json.dumps(final_chunk)}\n\n"


@app.route('/agent', methods=['POST'])
def agent():
    """
    Main agent endpoint - generates changelogs based on user requests
    """
    print('Received request:', json.dumps(request.json, indent=2))

    try:
        data = request.json
        messages = data.get('messages', [])

        if not messages:
            return {'error': 'No messages provided'}, 400

        user_message = messages[-1]['content']

        # Check if user is asking for help
        if 'help' in user_message.lower():
            response = """# Changelog Generator Help

I can generate changelogs from GitHub repositories!

## Usage Examples

1. **Generate changelog between tags:**
   `generate changelog for owner/repo from v1.0.0 to v2.0.0`

2. **Generate changelog since a tag:**
   `generate changelog for owner/repo since v1.0.0`

3. **Generate recent changelog:**
   `generate changelog for owner/repo`

## Format

I'll organize commits into:
- ✨ Features (commits with 'feat', 'feature', 'add', 'new')
- 🐛 Bug Fixes (commits with 'fix', 'bug', 'patch')
- 📝 Other Changes (all other commits)

## Note

Make sure the repository is public or you have access to it via the configured GITHUB_TOKEN.
"""
            return Response(
                stream_response(response),
                mimetype='text/event-stream',
                headers={'Cache-Control': 'no-cache', 'Connection': 'keep-alive'}
            )

        # Parse the request
        repo_name, from_tag, to_tag = parse_changelog_request(user_message)

        if not repo_name:
            response = """I couldn't find a repository name in your message.

Please use the format:
`generate changelog for owner/repo from v1.0.0 to v2.0.0`

Or ask for "help" to see more examples."""
            return Response(
                stream_response(response),
                mimetype='text/event-stream',
                headers={'Cache-Control': 'no-cache', 'Connection': 'keep-alive'}
            )

        # Generate changelog
        changelog = generate_changelog(repo_name, from_tag, to_tag)

        return Response(
            stream_response(changelog),
            mimetype='text/event-stream',
            headers={'Cache-Control': 'no-cache', 'Connection': 'keep-alive'}
        )

    except Exception as e:
        print(f'Error: {e}')
        error_response = f"Error: {str(e)}"
        return Response(
            stream_response(error_response),
            mimetype='text/event-stream',
            headers={'Cache-Control': 'no-cache', 'Connection': 'keep-alive'}
        )


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return {
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'github_token_configured': bool(GITHUB_TOKEN)
    }


@app.route('/', methods=['GET'])
def index():
    """Root endpoint with basic info"""
    return {
        'name': 'Changelog Generator Extension',
        'version': '1.0.0',
        'description': 'Generate changelogs from GitHub repositories',
        'endpoints': {
            'agent': 'POST /agent',
            'health': 'GET /health'
        }
    }


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    print(f'Starting Changelog Generator on port {port}')
    print(f'GitHub token configured: {bool(GITHUB_TOKEN)}')
    print(f'Health check: http://localhost:{port}/health')
    print(f'Agent endpoint: http://localhost:{port}/agent')
    app.run(host='0.0.0.0', port=port, debug=True)
