import { MediatorFactory } from './mediator.js';
import { IRequest, IQuery, ICommand, INotification, RequestType, NotificationType } from './types.js';
import { RequestHandler, NotificationHandler } from './types.js';
import { Result } from 'ts-micro-result';

/**
 * Edge-optimized helper functions for Mediator
 * Minimal memory, fast registration and batch operations
 */

// Lazy singleton - create only when needed
let _registry: any = null;

function ensureRegistry() {
  if (!_registry) {
    _registry = MediatorFactory.create();
  }
  return _registry;
}

/**
 * Register request handler - O(1)
 */
export function registerHandler<TResponse>(
  requestType: RequestType,
  handler: RequestHandler<IRequest<TResponse>, TResponse>
): void {
  const registry = ensureRegistry();
  registry.registry.registerHandler(requestType, handler);
}

/**
 * Register notification handler - O(1)
 */
export function registerNotificationHandler(
  notificationType: NotificationType,
  handler: NotificationHandler<INotification>
): void {
  const registry = ensureRegistry();
  registry.registry.registerNotificationHandler(notificationType, handler);
}

/**
 * Register request class - O(1)
 */
export function registerRequestClass(requestClass: any): void {
  const registry = ensureRegistry();
  registry.registry.registerRequestClass(requestClass);
}

/**
 * Register notification class - O(1)
 */
export function registerNotificationClass(notificationClass: any): void {
  const registry = ensureRegistry();
  registry.registry.registerNotificationClass(notificationClass);
}

/**
 * Create request instance - O(1)
 */
export function createRequestFromData<T>(requestType: RequestType, data: any): T | null {
  const registry = ensureRegistry();
  return registry.registry.createRequest(requestType, data) as T;
}

/**
 * Create notification instance - O(1)
 */
export function createNotificationFromData<T>(notificationType: NotificationType, data: any): T | null {
  const registry = ensureRegistry();
  return registry.registry.createNotification(notificationType, data) as T;
}

/**
 * Batch registration - O(n)
 */
export function registerBatch(registrations: {
  handlers?: Array<{ type: RequestType; handler: RequestHandler<any, any> }>;
  notificationHandlers?: Array<{ type: NotificationType; handler: NotificationHandler<any> }>;
  requestClasses?: any[];
  notificationClasses?: any[];
}): void {
  const registry = ensureRegistry();

  registrations.handlers?.forEach(({ type, handler }) => 
    registry.registry.registerHandler(type, handler)
  );
  registrations.notificationHandlers?.forEach(({ type, handler }) => 
    registry.registry.registerNotificationHandler(type, handler)
  );
  registrations.requestClasses?.forEach(cls => 
    registry.registry.registerRequestClass(cls)
  );
  registrations.notificationClasses?.forEach(cls => 
    registry.registry.registerNotificationClass(cls)
  );
}

/**
 * Get registry stats - O(1)
 */
export function getRegistryStats() {
  const registry = ensureRegistry();
  return registry.registry.getStats();
}

/**
 * Reset registry - O(n)
 */
export function resetRegistry(): void {
  MediatorFactory.reset();
}

/**
 * Send batch requests - O(n)
 */
export async function sendBatch<TResponse>(requests: (IQuery<TResponse> | ICommand<TResponse>)[]): Promise<Result<TResponse>[]> {
  const mediator = ensureRegistry();
  return mediator.sendBatch(requests);
}

/**
 * Publish batch notifications - O(n)
 */
export async function publishBatch<TNotification extends INotification>(notifications: TNotification[]): Promise<void> {
  const mediator = ensureRegistry();
  await mediator.publishBatch(notifications);
}

 