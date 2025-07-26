# ts-micro-mediator

[![npm version](https://badge.fury.io/js/ts-micro-mediator.svg)](https://badge.fury.io/js/ts-micro-mediator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

A lightweight, edge-optimized Mediator Pattern implementation for TypeScript. Designed for Cloudflare Workers, Node.js, Bun, Deno, and serverless/edge environments.

## Features
- 🚀 Edge-optimized, minimal memory footprint
- 🎯 CQRS: Command, Query, Notification separation
- 🏗️ TypeScript-first, type-safe
- 🔌 Framework-agnostic (Hono, Express, Fastify, Elysia, ...)
- 🤖 Example script for auto-registration
- 📦 Only 31KB unpacked

## Installation

```bash
npm install ts-micro-mediator
```

## API Structure

The library provides a clean separation between core functionality and advanced helpers:

### Core API (Main Export)
```typescript
import { 
  IQuery, ICommand, INotification, IMediator,
  sendRequest, publishNotification, getMediatorStats,
  registerHandler, registerNotificationHandler, registerRequestClass, registerNotificationClass
} from 'ts-micro-mediator';
```

### Advanced Helpers (Optional)
```typescript
import { 
  registerBatch, createRequestFromData, createNotificationFromData, getRegistryStats, resetRegistry, sendBatch, publishBatch
} from 'ts-micro-mediator/registry-helpers';
```

## Quick Start

### Queries (Read Operations)

```typescript
import { IQuery, sendRequest, RequestHandler, registerHandler } from 'ts-micro-mediator';
import { ok, Result } from 'ts-micro-result';

interface User {
  id: string;
  name: string;
  email: string;
}

class GetUserQuery implements IQuery<User> {
  readonly _response?: User;
  constructor(public userId: string) {}
}

// Simple way
const getUserHandler = async (query: GetUserQuery) => {
  const user: User = { id: query.userId, name: 'John Doe', email: 'john@example.com' };
  return ok(user);
};

// Explicit way
const getUserHandlerExplicit: RequestHandler<GetUserQuery, User> = async (query) => {
  const user: User = { id: query.userId, name: 'John Doe', email: 'john@example.com' };
  return ok(user);
};

registerHandler('GetUserQuery', getUserHandler);
const result = await sendRequest(new GetUserQuery('123'));
```

### Commands (Write Operations)

```typescript
import { ICommand, sendRequest, RequestHandler, registerHandler } from 'ts-micro-mediator';
import { ok, Result } from 'ts-micro-result';

interface User {
  id: string;
  name: string;
  email: string;
}

class CreateUserCommand implements ICommand<User> {
  readonly _response?: User;
  constructor(public name: string, public email: string) {}
}

// Simple way
const createUserHandler = async (command: CreateUserCommand) => {
  const user: User = { id: 'new-id', name: command.name, email: command.email };
  return ok(user);
};

// Explicit way
const createUserHandlerExplicit: RequestHandler<CreateUserCommand, User> = async (command) => {
  const user: User = { id: 'new-id', name: command.name, email: command.email };
  return ok(user);
};

registerHandler('CreateUserCommand', createUserHandler);
const result = await sendRequest(new CreateUserCommand('Jane', 'jane@example.com'));
```

### Notifications (Events)

```typescript
import { INotification, publishNotification, NotificationHandler, registerNotificationHandler } from 'ts-micro-mediator';

interface User {
  id: string;
  name: string;
  email: string;
}

class UserCreatedNotification implements INotification {
  constructor(public user: User) {}
}

// Simple way
const userCreatedHandler = async (notification: UserCreatedNotification) => {
  console.log('User created:', notification.user);
};

registerNotificationHandler('UserCreatedNotification', userCreatedHandler);
await publishNotification(new UserCreatedNotification({ id: '1', name: 'John', email: 'john@example.com' }));
```

---

## Example: Auto-Registration Script

> **Note:** The file `example/generate-handlers.js` in this repository is just an **example script** for auto-registering handlers. It is not included in the npm package. If you want to automate handler registration in your own project, you can copy, modify, or use this script as a reference.

**How to use the example script:**
1. Create handler files using the naming convention (`*.handler.ts`, `*.command.ts`, `*.query.ts`, `*.notification.ts`).
2. Run the script:
   ```bash
   node example/generate-handlers.js
   ```
3. Import the generated file:
   ```typescript
   import './generated-handlers.js';
   ```

---

## Framework Integration

### Direct Usage (Recommended)
```typescript
import { sendRequest } from 'ts-micro-mediator';

// Works with any framework - just call sendRequest directly
const result = await sendRequest(new GetUserQuery('123'));
```

### Hono (Cloudflare Workers)
```typescript
import { Hono } from 'hono';
import { sendRequest } from 'ts-micro-mediator';

const app = new Hono();

app.get('/users/:id', async (c) => {
  const userId = c.req.param('id');
  const result = await sendRequest(new GetUserQuery(userId));
  return result.ok 
    ? c.json(result.value)
    : c.json({ error: result.error }, 400);
});
```

### Express.js
```typescript
import express from 'express';
import { sendRequest } from 'ts-micro-mediator';

const app = express();
app.use(express.json());

app.get('/users/:id', async (req, res) => {
  const result = await sendRequest(new GetUserQuery(req.params.id));
  result.ok ? res.json(result.value) : res.status(400).json({ error: result.error });
});
```

### Optional Middleware
If you prefer middleware-style integration:
```typescript
import { mediatorMiddleware } from 'ts-micro-mediator';

// Hono
app.use('*', mediatorMiddleware());

// Express
app.use(mediatorMiddleware());
```

**Benefits of using middleware:**
- **Context injection**: Automatically injects mediator instance into request context
- **Error handling**: Centralized error handling for mediator operations
- **Request lifecycle**: Better integration with framework's request/response cycle
- **Middleware chain**: Can be combined with other middleware in the chain

**When to use direct usage vs middleware:**
- **Direct usage**: Simple applications, microservices, when you just need basic mediator functionality
- **Middleware**: Complex applications, when you need framework integration features, error handling, or context injection

## Framework Compatibility

- ✅ **Cloudflare Workers** (Hono, native)
- ✅ **Node.js** (Express, Fastify, Koa)
- ✅ **Bun** (Elysia, native)
- ✅ **Deno** (Oak, native)
- ✅ **Any HTTP framework** (direct usage)

---

## API Reference

### Core Interfaces
- `IQuery<TResponse>` — for queries (read operations)
- `ICommand<TResponse>` — for commands (write operations)
- `INotification` — for notifications/events

### Handler Types
- `RequestHandler<TRequest, TResponse>` — for command/query handlers
- `NotificationHandler<TNotification>` — for notification handlers

### Main Functions
- `registerHandler(type, handler)` — Register a handler for a command/query
- `sendRequest(request)` — Send a command/query (works with any framework)
- `sendBatch(requests)` — Send multiple requests
- `publishNotification(notification)` — Publish a notification
- `mediatorMiddleware()` — Optional framework middleware

---

## License
MIT — see [LICENSE](LICENSE)

## Support
- [Architecture Guide](ARCHITECTURE.md)
- [Issues](https://github.com/yourusername/ts-micro-mediator/issues)
- [Discussions](https://github.com/yourusername/ts-micro-mediator/discussions) 