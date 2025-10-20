/**
 * ts-micro-mediator - Edge-optimized Mediator Pattern
 * 
 * Main entry point - re-exports everything for convenience
 * For optimal tree shaking, use subpath imports:
 * - ts-micro-mediator/core - Core mediator functionality
 * - ts-micro-mediator/registry - Registry management
 * - ts-micro-mediator/middleware - Framework integration
 * - ts-micro-mediator/advanced - Advanced features
 * - ts-micro-mediator/lite - Minimal bundle
 */

// Re-export all submodules for convenience
export * from './core.js';
export * from './registry.js';
export * from './middleware.js';
export * from './advanced.js';

// Utility exports
export { isResult } from 'ts-micro-result';
