# Copilot SDK Examples

This directory contains example code for building GitHub Copilot Extensions using the Copilot SDK.

## What You'll Find Here

- **Node.js Example** (`extension-nodejs/`) — A complete Copilot Extension built with Node.js and Express
- **Python Example** (`extension-python/`) — A complete Copilot Extension built with Python and Flask
- **Changelog Generator** (`changelog-generator/`) — A domain-specific extension that generates changelogs from git history

## Prerequisites

Before running these examples, you'll need:

1. **GitHub Account** with Copilot access
2. **GitHub App** created in your account or organization
   - Navigate to Settings → Developer settings → GitHub Apps → New GitHub App
   - Enable **Copilot** permissions
   - Set the callback URL and webhook URL (use ngrok for local testing)
3. **Runtime Environment**
   - For Node.js: Node.js 18+ and npm
   - For Python: Python 3.9+ and pip
4. **ngrok** (or similar) for exposing local servers during development
   ```bash
   # Install ngrok
   brew install ngrok  # macOS
   # or download from https://ngrok.com/
   ```

## Quick Start

### Node.js Extension

```bash
cd extension-nodejs
npm install
npm start
```

Then in another terminal:
```bash
ngrok http 3000
```

Copy the ngrok URL and set it as your GitHub App's agent URL.

### Python Extension

```bash
cd extension-python
pip install -r requirements.txt
python app.py
```

Then in another terminal:
```bash
ngrok http 5000
```

Copy the ngrok URL and set it as your GitHub App's agent URL.

## Testing Your Extension

1. Install your GitHub App to your account/organization
2. Open GitHub Copilot Chat in VS Code or GitHub.com
3. Invoke your extension with `@your-app-name [message]`
4. The extension should respond via your local server

## Extension Architecture

A Copilot Extension consists of:

1. **Agent Endpoint** — An HTTPS endpoint that receives POST requests from GitHub
2. **Request Verification** — Validates that requests come from GitHub using signature verification
3. **Message Processing** — Parses the user's message and any context from Copilot
4. **Response Streaming** — Streams responses back using Server-Sent Events (SSE)

## API Contract

### Request Format

GitHub sends a POST request to your agent endpoint:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Help me understand this code"
    }
  ],
  "copilot_confirmations": [],
  "copilot_references": []
}
```

### Response Format (SSE)

Your agent responds with Server-Sent Events:

```
data: {"choices": [{"delta": {"content": "Hello"}, "finish_reason": null}]}

data: {"choices": [{"delta": {"content": " from"}, "finish_reason": null}]}

data: {"choices": [{"delta": {"content": " Copilot!"}, "finish_reason": null}]}

data: {"choices": [{"delta": {}, "finish_reason": "stop"}]}
```

## Resources

- [Building Copilot Extensions](https://docs.github.com/copilot/building-copilot-extensions) — Official GitHub documentation
- [Copilot Extensions Quickstart](https://docs.github.com/copilot/building-copilot-extensions/creating-a-copilot-extension/creating-a-github-app-for-your-copilot-extension) — Step-by-step guide
- [GitHub Apps Documentation](https://docs.github.com/apps) — Creating and managing GitHub Apps
- [Model Context Protocol](https://modelcontextprotocol.io/) — Reference implementation

## Security Notes

- Always verify request signatures to ensure requests originate from GitHub
- Store your GitHub App private key securely (use environment variables, never commit to git)
- Sanitize user input before processing
- Be mindful of rate limits when calling external APIs
- Consider implementing authentication if your extension accesses sensitive data

## Next Steps

1. Review the code examples
2. Modify them for your use case
3. Test locally with ngrok
4. Deploy to a production environment (e.g., Railway, Heroku, AWS Lambda)
5. Publish your GitHub App for others to use

## Support

For questions about the examples:
- Open an issue in this repository
- Refer to [GitHub Copilot documentation](https://docs.github.com/copilot)
- Join the [GitHub Community Forum](https://github.com/orgs/community/discussions)
