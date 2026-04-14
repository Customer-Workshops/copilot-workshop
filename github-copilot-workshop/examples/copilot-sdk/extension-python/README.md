# Python Copilot Extension Example

A simple GitHub Copilot Extension built with Python and Flask.

## Features

- Receives messages from GitHub Copilot Chat
- Streams responses using Server-Sent Events (SSE)
- Simple message processing logic
- Request signature verification (commented out for development)
- Health check endpoint

## Prerequisites

- Python 3.9 or higher
- pip
- A GitHub App with Copilot permissions
- ngrok (for local testing)

## Installation

1. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. (Optional) Set environment variables:
   ```bash
   export GITHUB_APP_ID="your-app-id"
   export GITHUB_PRIVATE_KEY="your-private-key"
   ```

## Running Locally

1. Start the server:
   ```bash
   python app.py
   ```

2. In another terminal, expose the server with ngrok:
   ```bash
   ngrok http 5000
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

## Project Structure

```
extension-python/
├── app.py              # Main application code
├── requirements.txt    # Python dependencies
└── README.md          # This file
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

```python
def stream_response(user_message):
    yield f"data: {json.dumps(chunk)}\n\n"
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

```python
def verify_signature(request_data, signature, secret):
    expected_signature = 'sha256=' + hmac.new(
        secret.encode(),
        request_data.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)
```

## Extending This Example

### Add Context from Repository

Access repository context from the request:

```python
@app.route('/agent', methods=['POST'])
def agent():
    data = request.json
    copilot_references = data.get('copilot_references', [])
    # copilot_references contains files, issues, PRs referenced in chat
```

### Call External APIs

Integrate with external services:

```python
import requests

def generate_response(user_message):
    response = requests.post('https://api.example.com/ai',
                           json={'prompt': user_message})
    return response.json()['text']
```

### Add State/Memory

Store conversation history:

```python
conversations = {}

@app.route('/agent', methods=['POST'])
def agent():
    conversation_id = request.json.get('conversation_id')
    history = conversations.get(conversation_id, [])

    # Process with history...

    conversations[conversation_id] = history + [new_message]
```

## Deployment

Deploy to production environments:

### Heroku
```bash
heroku create
git push heroku main
```

### Google Cloud Run
```bash
gcloud run deploy
```

### AWS Lambda
Use Zappa or AWS SAM.

### Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## Security Best Practices

1. **Verify signatures** — Always verify request signatures in production
2. **Environment variables** — Store secrets in environment variables
3. **HTTPS only** — Use HTTPS in production (required by GitHub)
4. **Rate limiting** — Use Flask-Limiter to prevent abuse
5. **Input validation** — Sanitize user input before processing

## Troubleshooting

### Extension not responding

- Check ngrok is running and URL is correct
- Verify GitHub App is installed
- Check Flask logs for errors
- Test health endpoint: `curl http://localhost:5000/health`

### Signature verification failing

- Ensure GITHUB_PRIVATE_KEY is set correctly
- Check that payload hasn't been modified
- Verify timestamp isn't too old

### Import errors

- Make sure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

## Resources

- [Building Copilot Extensions](https://docs.github.com/copilot/building-copilot-extensions)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Server-Sent Events Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
