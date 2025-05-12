# Scalable Winston Logger for Bun/TypeScript

A modular, TypeScript-first logging library built on top of Winston, designed specifically for Bun applications with scalability in mind.

## Features

- **TypeScript Support** - Full type safety with TypeScript interfaces
- **Bun Optimized** - Built to work well in Bun's JavaScript runtime environment
- **Modular Architecture** - Clean separation of concerns making it easy to extend
- **Multiple Transport Options**:
  - Console logging (development-friendly with colors)
  - Rotating file logs (with automatic log rotation)
  - Elasticsearch integration (for centralized logging)
- **Request Context Tracking** - Built-in middleware for HTTP servers
- **Child Loggers** - Create component-specific loggers with inherited context
- **Structured Logging** - JSON format for machine processing
- **Environment-aware Configuration** - Easily configure via environment variables
- **Graceful Shutdown** - Ensures logs get flushed before application exit

## Installation

```bash
bun add winston winston-daily-rotate-file winston-elasticsearch
```

## Basic Usage

```typescript
import Logger from './logger';

async function main() {
  // Initialize the logger
  const logger = await Logger.create();

  // Basic logging
  logger.info('Application started');
  logger.warn('Database connection is slow', { connectionTime: 1500 });
  logger.error('Failed to process payment', {
    orderId: '12345',
    userId: 'user-123',
    error: new Error('Payment gateway timeout')
  });

  // Child loggers for components
  const orderLogger = logger.createChild({ component: 'OrderService' });
  orderLogger.info('Order created', { orderId: 'ord-001' });

  // Graceful shutdown when done
  await logger.shutdown();
}

main().catch(console.error);
```

## Web Server Integration

### Using with Hono (Express-like for Bun)

```typescript
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import Logger from './logger';

async function startServer() {
  const logger = await Logger.create({ serviceId: 'api-server' });
  const app = new Hono();

  // Add request logging middleware
  app.use('*', logger.requestMiddleware());

  // Your routes
  app.get('/api/users', (c) => {
    const req = c.req.raw;
    (req as any).logger.info('Fetching users');
    return c.json({ users: [] });
  });

  // Start server
  serve({ fetch: app.fetch, port: 3000 });
  logger.info('Server started', { port: 3000 });
}

startServer();
```

### Using with native Bun server

```typescript
import { Logger } from './logger';

async function startBunServer() {
  const logger = await Logger.create();

  Bun.serve({
    port: 3000,
    async fetch(req) {
      const reqLogger = logger.createChild({
        traceId: req.headers.get('x-trace-id') || 'trace-' + Date.now(),
        method: req.method,
        url: req.url
      });

      reqLogger.info(`Request: ${req.method} ${new URL(req.url).pathname}`);

      // Your request handling
      return new Response('Hello World');
    },
  });

  logger.info('Bun server started', { port: 3000 });
}

startBunServer();
```

## Configuration

The logger can be configured using environment variables or by passing a configuration object when creating the logger:

```typescript
// Custom configuration
const logger = await Logger.create({
  logLevel: 'debug',
  logDirectory: './logs',
  serviceId: 'my-service',
  environment: 'production',
  consoleLogging: false,
  fileLogging: true,
  elasticsearchLogging: true,
  elasticsearchOptions: {
    level: 'info',
    clientOpts: {
      node: 'https://elastic.example.com:9200',
      auth: {
        username: 'logger',
        password: 'secret123'
      }
    },
    indexPrefix: 'my-app-logs'
  }
});
```

### Environment Variables

```
# General settings
LOG_LEVEL=info
LOG_DIRECTORY=logs
SERVICE_ID=app
NODE_ENV=production
BUN_ENV=production

# Transport options
CONSOLE_LOGGING=true
FILE_LOGGING=true
MAX_FILE_SIZE=50m
MAX_FILES=14d

# Elasticsearch settings
ELASTICSEARCH_LOGGING=true
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
ELASTICSEARCH_INDEX_PREFIX=logs
```

## Advanced Features

### Global Error Handling

```typescript
// Setup global handlers for uncaught exceptions
logger.setupGlobalHandlers();
```

### Graceful Shutdown

```typescript
// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down');

  // Close server connections
  server.close();

  // Close database connections
  await db.disconnect();

  // Ensure all logs are flushed
  await logger.shutdown();

  process.exit(0);
});
```

## Project Structure

```
src/
├── logger/
│   ├── index.ts           # Main logger class & exports
│   ├── types.ts           # TypeScript interfaces
│   ├── config.ts          # Configuration management
│   ├── formatters.ts      # Log format definitions
│   ├── transports.ts      # Transport setup
│   └── middlewares.ts     # Express/Hono middleware
└── examples/
    ├── basic-usage.ts     # Simple example
    ├── express-integration.ts # Web server example
    ├── bun-server.ts      # Native Bun server
    └── custom-config.ts   # Configuration example
```

## License

MIT
