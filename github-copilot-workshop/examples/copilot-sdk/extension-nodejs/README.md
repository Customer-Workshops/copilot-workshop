# Node.js Copilot Extension Example

A simple GitHub Copilot Extension built with Node.js and Express.

## Features

- Receives messages from GitHub Copilot Chat
- Streams responses using Server-Sent Events (SSE)
- Simple message processing logic
- Request signature verification (commented out for development)
- Health check endpoint

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A GitHub App with Copilot permissions
- ngrok (for local testing)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Set environment variables:
   ```bash
   export GITHUB_APP_ID="your-app-id"
   export GITHUB_PRIVATE_KEY="your-private-key"
   ```

## Running Locally

1. Start the server:
   ```bash
   npm start
   ```

2. In another terminal, expose the server with ngrok:
   ```bash
   ngrok http 3000
   ```

3. Copy the ngrok HTTPS URL and set it as your GitHub App's agent endpoint:
   - Go to your GitHub App settings
   - Under "Copilot", set the agent URL to: `https://your-ngrok-url.ngrok.io/agent`

4. Install your GitHub App to your account/organization

5. Test in Copilot Chat:
   ```
   @your-app-name Hello!
   @your-app-name What time is it?
   @your-app-name Help
   ```

## Development Mode

Run with automatic restart on file changes:
```bash
npm run dev
```

## Project Structure

```
extension-nodejs/
├── server.js       # Main server code
├── package.json    # Dependencies and scripts
└── README.md       # This file
```

## Key Concepts

### Agent Endpoint

The `/agent` endpoint receives POST requests from GitHub with the following format:

```json
{
  "messages": [
    {"role": "user", "content": "Hello!"}
  ]
}
```

### Response Streaming

Responses are streamed using Server-Sent Events (SSE):

```javascript
res.setHeader('Content-Type', 'text/event-stream');
res.write(`data: ${JSON.stringify(chunk)}\n\n`);
```

Each chunk follows this format:

```json
{
  "choices": [{
    "delta": {"content": "response text"},
    "finish_reason": null
  }]
}
```

The final chunk sets `finish_reason: "stop"`.

### Request Verification

In production, verify requests come from GitHub:

```javascript
function verifySignature(req, secret) {
  const signature = req.headers['x-hub-signature-256'];
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

## Extending This Example

### Add Context from Repository

Access repository context from the request:

```javascript
const { copilot_references } = req.body;
// copilot_references contains files, issues, PRs referenced in chat
```

### Call External APIs

Integrate with external services:

```javascript
async function generateResponse(userMessage) {
  const response = await fetch('https://api.example.com/ai', {
    method: 'POST',
    body: JSON.stringify({ prompt: userMessage })
  });
  return response.json();
}
```

### Add State/Memory

Store conversation history:

```javascript
const conversations = new Map();

app.post('/agent', async (req, res) => {
  const conversationId = req.body.conversation_id;
  const history = conversations.get(conversationId) || [];

  // Process with history...

  conversations.set(conversationId, [...history, newMessage]);
});
```

## Deployment

Deploy to production environments:

### Railway
```bash
railway up
```

### Heroku
```bash
git push heroku main
```

### AWS Lambda
Use serverless framework or AWS SAM.

## Security Best Practices

1. **Verify signatures** — Always verify request signatures in production
2. **Environment variables** — Store secrets in environment variables
3. **HTTPS only** — Use HTTPS in production (required by GitHub)
4. **Rate limiting** — Implement rate limiting to prevent abuse
5. **Input validation** — Sanitize user input before processing

## Troubleshooting

### Extension not responding

- Check ngrok is running and URL is correct
- Verify GitHub App is installed
- Check server logs for errors
- Test health endpoint: `curl http://localhost:3000/health`

### Signature verification failing

- Ensure GITHUB_PRIVATE_KEY is set correctly
- Check that payload hasn't been modified
- Verify timestamp isn't too old

## Resources

- [Building Copilot Extensions](https://docs.github.com/copilot/building-copilot-extensions)
- [Express.js Documentation](https://expressjs.com/)
- [Server-Sent Events Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
