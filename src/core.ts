/**
 * Core Mediator functionality
 * Minimal exports for essential mediator operations
 */

// Core classes
export { Mediator, MediatorFactory } from './mediator.js';
export { Registry } from './registry.js';

// Essential types
export type {
  IRequest,
  IQuery,
  ICommand,
  INotification,
  RequestType,
  NotificationType,
  RegistryStats,
  RequestClassConstructor,
  NotificationClassConstructor,
  IMediator,
  IRegistry
} from './types.js';

// Essential handlers
export type {
  RequestHandler,
  CommandHandler,
  QueryHandler,
  NotificationHandler
} from './types.js';
