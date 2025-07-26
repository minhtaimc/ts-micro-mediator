# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release preparation
- NPM package configuration
- Comprehensive documentation
- TypeScript support
- Edge computing optimization

## [1.0.0] - 2025-01-27

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