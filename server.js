// Server wrapper to ensure PORT binding on Render
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // Listen on all interfaces for Render
const port = parseInt(process.env.PORT || '3000', 10);

console.log('Starting BlockCity server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', port);
console.log('Hostname:', hostname);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    console.log('Next.js app prepared successfully');
    
    createServer(async (req, res) => {
      try {
        // Health check endpoint for Render
        if (req.url === '/health' || req.url === '/api/health') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
          return;
        }

        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    })
      .once('error', (err) => {
        console.error('Server error:', err);
        process.exit(1);
      })
      .listen(port, hostname, () => {
        console.log(`✓ Server ready on http://${hostname}:${port}`);
        console.log(`✓ Environment: ${process.env.NODE_ENV}`);
        console.log(`✓ Health check: http://${hostname}:${port}/health`);
      });
  })
  .catch((err) => {
    console.error('Failed to prepare Next.js app:', err);
    process.exit(1);
  });

