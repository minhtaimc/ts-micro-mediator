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
  NotificationHandler
} from './types.js';

// Public registry API (frequently used)
export {
  registerHandler,
  registerNotificationHandler,
  registerRequestClass,
  registerNotificationClass
} from './helpers.js';

// High-level middleware API
export {
  mediatorMiddleware,
  sendRequest,
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

// Note: Less frequently used helpers (batch, createFromData, ...) are in './helpers.js' 