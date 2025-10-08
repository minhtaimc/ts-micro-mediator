# ts-micro-mediator

[![npm version](https://badge.fury.io/js/ts-micro-mediator.svg)](https://badge.fury.io/js/ts-micro-mediator)
![npm bundle size](https://img.shields.io/bundlephobia/min/ts-micro-mediator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

A lightweight, edge-optimized Mediator Pattern implementation for TypeScript. Designed for Cloudflare Workers, Node.js, Bun, Deno, and serverless/edge environments.

## Features
- 🚀 Edge-optimized, minimal memory footprint
- 🎯 CQRS: Command, Query, Notification separation
- 🏗️ TypeScript-first, fully type-safe
- 🔌 Framework-agnostic (Hono, Express, Fastify, Elysia, ...)
- 📦 Only 31KB unpacked

## Installation

```bash
npm install ts-micro-mediator
```

## Why CQRS Pattern?

This library uses the **CQRS (Command Query Responsibility Segregation)** pattern:

- **Commands** — Write operations (Create, Update, Delete)
- **Queries** — Read operations (Get, List, Search)
- **Notifications** — Events (UserCreated, OrderPlaced)

**Benefits:**
- ✅ **Fully type-safe** - No type checking errors when registering handlers
- ✅ **Clear separation** - Easy to understand what modifies data vs what reads data
- ✅ **Better IDE support** - Enhanced autocomplete and type inference
- ✅ **Maintainable** - Scales well as your application grows

---

## Quick Start

### 1. Define Query (Read Operation)

```typescript
import { IQuery, QueryHandler, registerQueryHandler, sendQuery } from 'ts-micro-mediator';
import { ok } from 'ts-micro-result';

interface User { id: string; name: string; }

class GetUserQuery implements IQuery<User> {
  constructor(public userId: string) {}
}

const getUserHandler: QueryHandler<GetUserQuery, User> = async (query) => {
  const user = { id: query.userId, name: 'John Doe' };
  return ok(user);
};

registerQueryHandler('GetUserQuery', getUserHandler);

// Execute
const result = await sendQuery(new GetUserQuery('123'));
if (result.ok) {
  console.log(result.value); // { id: '123', name: 'John Doe' }
}
```

### 2. Define Command (Write Operation)

```typescript
import { ICommand, CommandHandler, registerCommandHandler, sendCommand } from 'ts-micro-mediator';
import { ok } from 'ts-micro-result';

class CreateUserCommand implements ICommand<User> {
  constructor(public name: string, public email: string) {}
}

const createUserHandler: CommandHandler<CreateUserCommand, User> = async (cmd) => {
  const user = { id: 'new-id', name: cmd.name, email: cmd.email };
  return ok(user);
};

registerCommandHandler('CreateUserCommand', createUserHandler);

// Execute
const result = await sendCommand(new CreateUserCommand('Jane', 'jane@example.com'));
```

### 3. Define Notification (Event)

```typescript
import { INotification, registerNotificationHandler, publishNotification } from 'ts-micro-mediator';

class UserCreatedNotification implements INotification {
  constructor(public user: User) {}
}

registerNotificationHandler('UserCreatedNotification', async (notification) => {
  console.log('User created:', notification.user);
  // Send email, update cache, etc.
});

// Publish
await publishNotification(new UserCreatedNotification({ id: '1', name: 'John' }));
```

---

## Advanced Usage

### Generic Way (Without CQRS)

If you prefer a simpler approach without separating Commands and Queries:

```typescript
import { registerHandler, sendRequest } from 'ts-micro-mediator';

// Register
registerHandler('GetUserQuery', getUserHandler);
registerHandler('CreateUserCommand', createUserHandler);

// Execute
const result = await sendRequest(new GetUserQuery('123'));
const createResult = await sendRequest(new CreateUserCommand('Jane', 'jane@example.com'));
```

### Direct Mediator Instance

For advanced scenarios (testing, dependency injection):

```typescript
import { Mediator, Registry } from 'ts-micro-mediator';

const registry = new Registry();
const mediator = new Mediator(registry);

// Register
registry.registerCommandHandler('CreateUserCommand', createUserHandler);
registry.registerQueryHandler('GetUserQuery', getUserHandler);

// Execute
const result = await mediator.sendCommand(new CreateUserCommand('John', 'john@example.com'));
```

### Batch Operations

```typescript
import { sendCommandBatch, sendQueryBatch, publishBatch } from 'ts-micro-mediator';

// Execute multiple commands
const commands = [
  new CreateUserCommand('John', 'john@example.com'),
  new CreateUserCommand('Jane', 'jane@example.com')
];
const results = await sendCommandBatch(commands);

// Execute multiple queries
const queries = [
  new GetUserQuery('123'),
  new GetUserQuery('456')
];
const queryResults = await sendQueryBatch(queries);

// Publish multiple notifications
const notifications = [
  new UserCreatedNotification(user1),
  new UserCreatedNotification(user2)
];
await publishBatch(notifications);
```

### Error Handling

```typescript
const result = await sendCommand(new CreateUserCommand('John', 'john@example.com'));

if (result.ok) {
  console.log('Success:', result.value);
} else {
  console.error('Error:', result.error);
}
```

### Auto-Registration

Check out `examples/generate-handlers.js` for a script that automatically registers handlers based on file naming conventions (`*.command.ts`, `*.query.ts`, `*.handler.ts`).

---

## Framework Integration

### Hono (Cloudflare Workers)

```typescript
import { Hono } from 'hono';
import { sendQuery, sendCommand } from 'ts-micro-mediator';

const app = new Hono();

app.get('/users/:id', async (c) => {
  const result = await sendQuery(new GetUserQuery(c.req.param('id')));
  return result.ok ? c.json(result.value) : c.json({ error: result.error }, 400);
});

app.post('/users', async (c) => {
  const body = await c.req.json();
  const result = await sendCommand(new CreateUserCommand(body.name, body.email));
  return result.ok ? c.json(result.value, 201) : c.json({ error: result.error }, 400);
});

export default app;
```

### Express.js

```typescript
import express from 'express';
import { sendQuery, sendCommand } from 'ts-micro-mediator';

const app = express();
app.use(express.json());

app.get('/users/:id', async (req, res) => {
  const result = await sendQuery(new GetUserQuery(req.params.id));
  result.ok ? res.json(result.value) : res.status(400).json({ error: result.error });
});

app.post('/users', async (req, res) => {
  const result = await sendCommand(new CreateUserCommand(req.body.name, req.body.email));
  result.ok ? res.status(201).json(result.value) : res.status(400).json({ error: result.error });
});

app.listen(3000);
```

### Optional Middleware

```typescript
import { mediatorMiddleware } from 'ts-micro-mediator';

// Hono
app.use('*', mediatorMiddleware());

// Express
app.use(mediatorMiddleware());

// Access mediator from context
app.get('/users/:id', async (c) => {
  const result = await c.mediator.sendQuery(new GetUserQuery(c.req.param('id')));
  return c.json(result.value);
});
```

---

## API Reference

### Interfaces

```typescript
// Base interfaces
interface ICommand<TResponse = void> { }
interface IQuery<TResponse> { }
interface INotification { }
interface IMediator { }
interface IRegistry { }

// Stats
interface RegistryStats {
  requestHandlers: number;
  notificationHandlers: number;
  requestClasses: number;
  notificationClasses: number;
}
```

### Handler Types

```typescript
// CQRS Pattern (Type-safe)
type CommandHandler<TCommand extends ICommand<TResponse>, TResponse = void> = 
  (command: TCommand) => Promise<Result<TResponse>>;

type QueryHandler<TQuery extends IQuery<TResponse>, TResponse = void> = 
  (query: TQuery) => Promise<Result<TResponse>>;

// Generic (Backward compatibility)
type RequestHandler<TRequest extends IRequest<TResponse>, TResponse = void> = 
  (request: TRequest) => Promise<Result<TResponse>>;

// Notifications
type NotificationHandler<TNotification extends INotification> = 
  (notification: TNotification) => Promise<void>;
```

### Registration Functions

**CQRS Pattern:**
```typescript
// Type-safe registration
registerCommandHandler<TCommand, TResponse>(
  type: string, 
  handler: CommandHandler<TCommand, TResponse>
): void;

registerQueryHandler<TQuery, TResponse>(
  type: string, 
  handler: QueryHandler<TQuery, TResponse>
): void;
```

**Generic Way:**
```typescript
// Generic registration
registerHandler<TResponse>(
  type: string, 
  handler: RequestHandler<IRequest<TResponse>, TResponse>
): void;
```

**Notifications:**
```typescript
registerNotificationHandler(
  type: string, 
  handler: NotificationHandler<INotification>
): void;
```

**Class Registration:**
```typescript
registerRequestClass(requestClass: RequestClassConstructor): void;
registerNotificationClass(notificationClass: NotificationClassConstructor): void;
```

### Execution Functions

**CQRS Pattern:**
```typescript
sendCommand<TResponse>(command: ICommand<TResponse>): Promise<Result<TResponse>>;
sendQuery<TResponse>(query: IQuery<TResponse>): Promise<Result<TResponse>>;
```

**Generic Way:**
```typescript
sendRequest<TResponse>(request: IRequest<TResponse>): Promise<Result<TResponse>>;
```

**Notifications:**
```typescript
publishNotification<TNotification extends INotification>(
  notification: TNotification
): Promise<void>;
```

**Batch Operations:**
```typescript
sendCommandBatch<TResponse>(commands: ICommand<TResponse>[]): Promise<Result<TResponse>[]>;
sendQueryBatch<TResponse>(queries: IQuery<TResponse>[]): Promise<Result<TResponse>[]>;
sendBatch<TResponse>(requests: IRequest<TResponse>[]): Promise<Result<TResponse>[]>;
publishBatch<TNotification extends INotification>(notifications: TNotification[]): Promise<void>;
```

**Utility Functions:**
```typescript
getMediatorStats(): RegistryStats;
getRegistryStats(): RegistryStats;
resetRegistry(): void;
mediatorMiddleware(): MiddlewareFunction;
```

**Factory & Creation:**
```typescript
createRequestFromData<T extends IRequest<any>>(type: string, data: any): T | null;
createNotificationFromData<T extends INotification>(type: string, data: any): T | null;
```

**Batch Registration:**
```typescript
registerBatch(registrations: {
  handlers?: Array<{ type: string; handler: RequestHandler<any, any> }>;
  notificationHandlers?: Array<{ type: string; handler: NotificationHandler<any> }>;
  requestClasses?: RequestClassConstructor[];
  notificationClasses?: NotificationClassConstructor[];
}): void;
```

### Mediator Class

```typescript
class Mediator implements IMediator {
  constructor(registry: Registry);
  
  // CQRS Pattern
  sendCommand<TResponse>(command: ICommand<TResponse>): Promise<Result<TResponse>>;
  sendQuery<TResponse>(query: IQuery<TResponse>): Promise<Result<TResponse>>;
  
  // Generic
  send<TResponse>(request: IRequest<TResponse>): Promise<Result<TResponse>>;
  
  // Notifications
  publish<TNotification extends INotification>(notification: TNotification): Promise<void>;
  
  // Batch operations
  sendCommandBatch<TResponse>(commands: ICommand<TResponse>[]): Promise<Result<TResponse>[]>;
  sendQueryBatch<TResponse>(queries: IQuery<TResponse>[]): Promise<Result<TResponse>[]>;
  sendBatch<TResponse>(requests: IRequest<TResponse>[]): Promise<Result<TResponse>[]>;
  publishBatch<TNotification extends INotification>(notifications: TNotification[]): Promise<void>;
  
  // Utility
  getStats(): RegistryStats;
  get registry(): IRegistry;
}
```

### Registry Class

```typescript
class Registry implements IRegistry {
  // CQRS Pattern
  registerCommandHandler<TCommand, TResponse>(type: string, handler: CommandHandler<TCommand, TResponse>): void;
  registerQueryHandler<TQuery, TResponse>(type: string, handler: QueryHandler<TQuery, TResponse>): void;
  
  // Generic
  registerHandler<TResponse>(type: string, handler: RequestHandler<IRequest<TResponse>, TResponse>): void;
  
  // Notifications
  registerNotificationHandler(type: string, handler: NotificationHandler<INotification>): void;
  
  // Retrieval
  getHandler(type: string): RequestHandler<any, any> | undefined;
  getNotificationHandlers(type: string): NotificationHandler<any>[];
  
  // Class registration
  registerRequestClass(requestClass: RequestClassConstructor): void;
  registerNotificationClass(notificationClass: NotificationClassConstructor): void;
  
  // Factory
  createRequest(type: string, data: any): IRequest<any> | null;
  createNotification(type: string, data: any): INotification | null;
  
  // Utility
  reset(): void;
  getStats(): RegistryStats;
}
```

### MediatorFactory

```typescript
class MediatorFactory {
  static create(): Mediator;
  static createWithRegistry(registry: Registry): Mediator;
  static reset(): void;
  static getRegistry(): Registry | null;
}
```

---

## Framework Compatibility

- ✅ **Cloudflare Workers** (Hono, native)
- ✅ **Node.js** (Express, Fastify, Koa)
- ✅ **Bun** (Elysia, native)
- ✅ **Deno** (Oak, native)
- ✅ **Any HTTP framework**

---

## License
MIT — see [LICENSE](LICENSE)

## Links
- [Architecture Guide](ARCHITECTURE.md)
- [Changelog](CHANGELOG.md)
- [Issues](https://github.com/minhtaimc/ts-micro-mediator/issues)
- [Discussions](https://github.com/minhtaimc/ts-micro-mediator/discussions)
