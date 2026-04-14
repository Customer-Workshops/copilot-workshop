import os
import json
import time
import hmac
import hashlib
from datetime import datetime
from flask import Flask, request, Response

app = Flask(__name__)

# GitHub App credentials (load from environment variables in production)
GITHUB_APP_ID = os.getenv('GITHUB_APP_ID')
GITHUB_PRIVATE_KEY = os.getenv('GITHUB_PRIVATE_KEY')


def verify_signature(request_data, signature, secret):
    """
    Verify that the request came from GitHub using the signature
    """
    if not signature:
        return False

    expected_signature = 'sha256=' + hmac.new(
        secret.encode(),
        request_data.encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected_signature)


def generate_response(user_message):
    """
    Generate a response based on the user's message.
    In a real extension, this could call an AI model, search a database, etc.
    """
    message = user_message.lower()

    if 'hello' in message or 'hi' in message:
        return "Hello! I'm a custom Copilot Extension built with Python. I can help you with various tasks. What would you like to know?"
    elif 'time' in message:
        return f"The current time is {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}. How can I help you today?"
    elif 'help' in message:
        return """I can assist you with:
- Answering questions
- Providing the current time
- General information

Just ask me anything!"""
    else:
        return f'You said: "{user_message}". I\'m a simple extension example, so I can only respond to basic queries. Try asking for help, the time, or saying hello!'


def stream_response(user_message):
    """
    Stream a response back to Copilot using Server-Sent Events
    """
    # Generate the response
    response = generate_response(user_message)

    # Split into words and stream them
    words = response.split(' ')

    for word in words:
        chunk = {
            "choices": [{
                "delta": {"content": word + ' '},
                "finish_reason": None
            }]
        }

        yield f"data: {json.dumps(chunk)}\n\n"

        # Simulate streaming delay
        time.sleep(0.05)

    # Send final chunk to indicate completion
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
    Main agent endpoint - handles requests from GitHub Copilot
    """
    print('Received request:', json.dumps(request.json, indent=2))

    # TODO: In production, verify the request signature
    # signature = request.headers.get('X-Hub-Signature-256')
    # if not verify_signature(request.data.decode(), signature, GITHUB_PRIVATE_KEY):
    #     return {'error': 'Unauthorized'}, 401

    try:
        data = request.json
        messages = data.get('messages', [])

        if not messages:
            return {'error': 'No messages provided'}, 400

        user_message = messages[-1]['content']

        # Return Server-Sent Events response
        return Response(
            stream_response(user_message),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        )

    except Exception as e:
        print(f'Error: {e}')
        return {'error': 'Internal server error'}, 500


@app.route('/health', methods=['GET'])
def health():
    """
    Health check endpoint
    """
    return {
        'status': 'ok',
        'timestamp': datetime.now().isoformat()
    }


@app.route('/', methods=['GET'])
def index():
    """
    Root endpoint with basic info
    """
    return {
        'name': 'Copilot Extension Example (Python)',
        'version': '1.0.0',
        'endpoints': {
            'agent': 'POST /agent',
            'health': 'GET /health'
        }
    }


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f'Starting Copilot Extension server on port {port}')
    print(f'Health check: http://localhost:{port}/health')
    print(f'Agent endpoint: http://localhost:{port}/agent')
    app.run(host='0.0.0.0', port=port, debug=True)
