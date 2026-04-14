const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// GitHub App credentials (load from environment variables in production)
const GITHUB_APP_ID = process.env.GITHUB_APP_ID;
const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY;

/**
 * Verify that the request came from GitHub using the signature
 */
function verifySignature(req, secret) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return false;
  }

  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * Main agent endpoint - handles requests from GitHub Copilot
 */
app.post('/agent', async (req, res) => {
  console.log('Received request:', JSON.stringify(req.body, null, 2));

  // TODO: In production, verify the request signature
  // if (!verifySignature(req, GITHUB_PRIVATE_KEY)) {
  //   return res.status(401).send('Unauthorized');
  // }

  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content;

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response
    await streamResponse(res, userMessage);

    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Stream a response back to Copilot using Server-Sent Events
 */
async function streamResponse(res, userMessage) {
  // Generate a response based on the user's message
  const response = generateResponse(userMessage);

  // Split the response into chunks and stream them
  const words = response.split(' ');

  for (const word of words) {
    const chunk = {
      choices: [{
        delta: { content: word + ' ' },
        finish_reason: null
      }]
    };

    res.write(`data: ${JSON.stringify(chunk)}\n\n`);

    // Simulate streaming delay
    await sleep(50);
  }

  // Send final chunk to indicate completion
  const finalChunk = {
    choices: [{
      delta: {},
      finish_reason: 'stop'
    }]
  };

  res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
}

/**
 * Generate a response based on the user's message
 * In a real extension, this could call an AI model, search a database, etc.
 */
function generateResponse(userMessage) {
  const message = userMessage.toLowerCase();

  if (message.includes('hello') || message.includes('hi')) {
    return 'Hello! I\'m a custom Copilot Extension. I can help you with various tasks. What would you like to know?';
  } else if (message.includes('time')) {
    return `The current time is ${new Date().toLocaleString()}. How can I help you today?`;
  } else if (message.includes('help')) {
    return 'I can assist you with:\n- Answering questions\n- Providing the current time\n- General information\n\nJust ask me anything!';
  } else {
    return `You said: "${userMessage}". I'm a simple extension example, so I can only respond to basic queries. Try asking for help, the time, or saying hello!`;
  }
}

/**
 * Helper function to add delays for streaming effect
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Root endpoint with basic info
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Copilot Extension Example',
    version: '1.0.0',
    endpoints: {
      agent: 'POST /agent',
      health: 'GET /health'
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Copilot Extension server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Agent endpoint: http://localhost:${PORT}/agent`);
});
