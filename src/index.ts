/**
 * ts-micro-mediator - Edge-optimized Mediator Pattern
 * 
 * High-level API for Cloudflare Workers and edge computing
 * Minimal memory footprint, fast execution
 */

// Public interfaces - what users should implement
export {
  IQuery, 
  ICommand,
  INotification,
  IMediator,
  IRequest,
  RequestHandler,
  CommandHandler,
  QueryHandler,
  NotificationHandler
} from './types.js';

// Public registry API (frequently used)
export {
  registerHandler,
  registerCommandHandler,
  registerQueryHandler,
  registerNotificationHandler,
  registerRequestClass,
  registerNotificationClass
} from './helpers.js';

// High-level middleware API
export {
  mediatorMiddleware,
  sendRequest,
  sendCommand,
  sendQuery,
  publishNotification,
  getMediatorStats
} from './middleware.js';

// Advanced helper functions (less frequently used)
export {
  createRequestFromData,
  createNotificationFromData,
  registerBatch,
  getRegistryStats,
  resetRegistry,
  sendBatch,
  publishBatch
} from './helpers.js';

// Advanced: Mediator and Registry classes for direct instantiation
export { Mediator, MediatorFactory } from './mediator.js';
export { Registry } from './registry.js';

// Note: Less frequently used helpers (batch, createFromData, ...) are in './helpers.js' 