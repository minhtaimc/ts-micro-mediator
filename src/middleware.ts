import { MediatorFactory } from './mediator.js';
import { IQuery, ICommand, INotification, IMediator, RegistryStats } from './types.js';
import { Result } from 'ts-micro-result';

/**
 * Edge-optimized middleware for Mediator
 * Minimal memory, fast integration for edge/server frameworks
 */

// Lazy singleton - create only when needed
let _mediator: IMediator | null = null;

function getMediator(): IMediator {
  if (!_mediator) {
    _mediator = MediatorFactory.create();
  }
  return _mediator;
}

/**
 * Middleware for framework integration
 * Attaches mediator instance to request context
 */
export function mediatorMiddleware() {
  return async (ctx: any, next: () => Promise<void>): Promise<void> => {
    // Attach mediator to context for framework integration
    ctx.mediator = getMediator();
    await next();
  };
}

/**
 * Send request via singleton mediator
 * Returns Promise<Result<TResponse>> for type-safe error handling
 */
export async function sendRequest<TResponse>(
  request: IQuery<TResponse> | ICommand<TResponse>
): Promise<Result<TResponse>> {
  const mediator = getMediator();
  return await mediator.send(request);
}

/**
 * Publish notification via singleton mediator
 */
export async function publishNotification<TNotification extends INotification>(
  notification: TNotification
): Promise<void> {
  const mediator = getMediator();
  return await mediator.publish(notification);
}

/**
 * Get mediator stats
 */
export function getMediatorStats(): RegistryStats {
  return getMediator().getStats();
} 