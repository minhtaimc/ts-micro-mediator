# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-10-15

### Added
- `resolveMediator()` helper for fetching the shared mediator without mutating context.
- Runtime `isResult` tests to ensure handler outputs honour `ts-micro-result` 2.x contracts.

### Changed
- Hardened `attachMediator()` to avoid overwriting existing mediator instances and added richer documentation.
- Optimized test workflow with smarter build caching and a streamlined `npm test` script.
- Updated guides and architecture notes to reflect new mediator helper usage.

## [1.1.0] - 2025-10-08

### Added
- **CQRS Pattern Enhancement**: Separate type-safe handlers for Commands and Queries
  - `CommandHandler<TCommand, TResponse>` type for command handlers
  - `QueryHandler<TQuery, TResponse>` type for query handlers
  - `registerCommandHandler()` function for type-safe command registration
  - `registerQueryHandler()` function for type-safe query registration
  - `sendCommand()` function for executing commands
  - `sendQuery()` function for executing queries
- Batch operations with CQRS support:
  - `sendCommandBatch()` for executing multiple commands
  - `sendQueryBatch()` for executing multiple queries
- Export `Mediator` and `Registry` classes for advanced usage
- Export `MediatorFactory` for custom mediator instances

### Changed
- Improved type safety when registering handlers (eliminates type checking errors)
- Enhanced README with clearer structure and examples
- Better separation of concerns between Commands (write) and Queries (read)
- Reorganized documentation: simple examples first, detailed API reference later

### Improved
- Better IDE autocomplete support with explicit Command/Query types
- Enhanced type inference for handler registration
- Clearer error messages for type mismatches

### Backward Compatible
- All existing `registerHandler()` and `sendRequest()` functions still work
- No breaking changes for existing code
- Generic way still supported alongside CQRS pattern

## [1.0.0] - 2025-07-26

### Added
- Edge-optimized mediator pattern implementation
- TypeScript-first design with full type safety
- CQRS pattern support (IQuery, ICommand, INotification)
- Request/Response handling with ts-micro-result
- Request and notification batching
- Singleton pattern for serverless environments
- Framework-agnostic middleware (Hono, Express, Fastify, Elysia)
- Auto-generation support for handler registration
- Multi-platform support (Cloudflare Workers, Node.js, Bun, Deno)
- Memory-efficient design for edge computing
- O(1) handler lookups using Map
- Comprehensive error handling with Result pattern
- Performance monitoring and statistics

### Features
- **Edge-Optimized**: Minimal memory footprint, fast execution for edge computing
- **CQRS Pattern**: Clean separation of Commands, Queries, and Notifications
- **Request Batching**: Process multiple requests efficiently
- **TypeScript First**: Full type safety with modern TypeScript
- **Multi-Platform**: Works on Cloudflare Workers, Node.js, Bun, Deno
- **Lightweight**: Only 31KB unpacked size
- **Framework Agnostic**: Easy integration with Hono, Express, Fastify, Elysia
- **Auto-Generation**: Generate handler registrations automatically
- **Singleton Pattern**: Optimized for serverless environments

### Technical Details
- Built with TypeScript 5.0+
- Uses `ts-micro-result` for functional error handling
- ES modules support
- Node.js 18+ compatibility
- MIT License
- 31KB package size (unpacked)
- 7.7KB package size (packed)
- Zero runtime dependencies (except ts-micro-result) 
