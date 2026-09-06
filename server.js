/**
 * Production Server Entry Point for Berakhah Gardens
 * Compatible with cPanel Node.js hosting
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// Configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Ensure critical environment variables are present in production
if (!dev) {
  console.log('🚀 Production Mode - Environment Check:');
  console.log('✓ NODE_ENV:', process.env.NODE_ENV);
  console.log('✓ PORT:', port);
  console.log('✓ HOSTNAME:', hostname);
  
  if (!process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.warn('⚠️  WARNING: WHATSAPP_PHONE_NUMBER_ID not set - bookings will be saved locally');
  }
  if (!process.env.WHATSAPP_ACCESS_TOKEN) {
    console.warn('⚠️  WARNING: WHATSAPP_ACCESS_TOKEN not set - bookings will be saved locally');
  }
}

// Initialize Next.js
const app = next({ dev, dir: path.join(__dirname) });
const handle = app.getRequestHandler();

// Health check endpoint
const healthCheckHandler = (req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }));
    return true;
  }
  return false;
};

// Prepare and start server
app.prepare()
  .then(() => {
    createServer((req, res) => {
      // Handle health checks
      if (healthCheckHandler(req, res)) {
        return;
      }

      // Parse URL
      const parsedUrl = parse(req.url, true);
      
      // Handle requests
      handle(req, res, parsedUrl);
    }).listen(port, (err) => {
      if (err) {
        console.error('❌ Server failed to start:', err);
        process.exit(1);
      }
      
      console.log('');
      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║     Berakhah Gardens - Next.js Production Server        ║');
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`✓ Server running at: http://${hostname}:${port}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Ready to accept requests`);
      console.log('');
      console.log('📊 Monitoring:');
      console.log(`   Health check: http://${hostname}:${port}/api/health`);
      console.log('');
    });
  })
  .catch((ex) => {
    console.error('❌ Failed to prepare server:', ex);
    process.exit(1);
  });

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('');
  console.log('⚠️  SIGTERM received - shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('');
  console.log('⚠️  SIGINT received - shutting down gracefully...');
  process.exit(0);
});

// Unhandled Errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
