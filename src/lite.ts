/**
 * Lite version of ts-micro-mediator
 * Minimal exports for optimal tree shaking
 * Only includes the most essential functionality
 */

// Core mediator functionality
export { Mediator, MediatorFactory } from './mediator.js';

// Essential types only
export type {
  IRequest,
  IQuery,
  ICommand,
  INotification,
  IMediator
} from './types.js';

// Essential handlers only
export type {
  CommandHandler,
  QueryHandler,
  NotificationHandler
} from './types.js';

// Essential helpers only
export {
  registerCommandHandler,
  registerQueryHandler,
  registerNotificationHandler
} from './helpers.js';

export {
  sendCommand,
  sendQuery,
  publishNotification
} from './middleware.js';

// Essential ts-micro-result utilities only
export { Result, ok, err, isResult } from 'ts-micro-result';
