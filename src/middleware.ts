import { MediatorFactory } from './mediator.js';
import { IQuery, ICommand, INotification } from './types.js';

/**
 * Edge-optimized middleware for Mediator
 * Minimal memory, fast integration for edge/server frameworks
 */

// Lazy singleton - create only when needed
let _mediator: any = null;

function getMediator() {
  if (!_mediator) {
    _mediator = MediatorFactory.create();
  }
  return _mediator;
}

/**
 * Middleware for framework integration
 */
export function mediatorMiddleware() {
  return async (_c: any, next: () => Promise<void>) => {
    await next();
  };
}

/**
 * Send request via singleton mediator
 */
export async function sendRequest<TResponse>(request: IQuery<TResponse> | ICommand<TResponse>) {
  const mediator = getMediator();
  return await mediator.send(request);
}

/**
 * Publish notification via singleton mediator
 */
export async function publishNotification<TNotification extends INotification>(notification: TNotification) {
  const mediator = getMediator();
  return await mediator.publish(notification);
}

/**
 * Get mediator stats
 */
export function getMediatorStats() {
  return getMediator().getStats();
} 