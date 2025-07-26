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
  RequestHandler,
  NotificationHandler
} from './types.js';

// High-level registration API
export {
  registerHandler,
  registerNotificationHandler,
  registerRequestClass,
  registerNotificationClass,
  registerBatch
} from './helpers.js';

// High-level execution API
export {
  sendBatch,
  publishBatch
} from './helpers.js';

// High-level middleware API
export {
  mediatorMiddleware,
  sendRequest,
  publishNotification,
  getMediatorStats
} from './middleware.js'; 