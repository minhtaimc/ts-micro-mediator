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
 * Access the shared mediator instance without mutating any context.
 */
export function resolveMediator(): IMediator {
  return getMediator();
}

export type WithMediator<TContext> = TContext & { mediator: IMediator };

/**
 * Attach mediator to the given context with proper typing for framework integrations.
 */
export function attachMediator<TContext extends Record<string, unknown>>(
  ctx: TContext
): WithMediator<TContext> {
  const mediator = getMediator();
  const withMediator = ctx as WithMediator<TContext>;

  if (withMediator.mediator && withMediator.mediator !== mediator) {
    return withMediator;
  }

  if (!withMediator.mediator) {
    withMediator.mediator = mediator;
  }

  return withMediator;
}

/**
 * Middleware for framework integration
 * Attaches mediator instance to request context
 */
export function mediatorMiddleware() {
  return async (ctx: any, next: () => Promise<void>): Promise<void> => {
    // Attach mediator to context for framework integration
    attachMediator(ctx);
    await next();
  };
}

/**
 * Send command via singleton mediator - CQRS Pattern
 * Returns Promise<Result<TResponse>> for type-safe error handling
 */
export async function sendCommand<TResponse>(
  command: ICommand<TResponse>
): Promise<Result<TResponse>> {
  const mediator = getMediator();
  return await mediator.sendCommand(command);
}

/**
 * Send query via singleton mediator - CQRS Pattern
 * Returns Promise<Result<TResponse>> for type-safe error handling
 */
export async function sendQuery<TResponse>(
  query: IQuery<TResponse>
): Promise<Result<TResponse>> {
  const mediator = getMediator();
  return await mediator.sendQuery(query);
}

/**
 * Send request via singleton mediator - Generic (backward compatibility)
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
