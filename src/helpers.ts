import { MediatorFactory } from './mediator.js';
import { 
  IRequest, 
  IQuery, 
  ICommand, 
  INotification, 
  RequestType, 
  NotificationType,
  RegistryStats,
  RequestClassConstructor,
  NotificationClassConstructor,
  IMediator
} from './types.js';
import { RequestHandler, NotificationHandler } from './types.js';
import { Result } from 'ts-micro-result';

/**
 * Registry Helper Functions
 * Internal utilities for registry management - not exported from main API
 */

// Single mediator instance
let _mediator: IMediator | null = null;

function ensureMediator(): IMediator {
  if (!_mediator) {
    _mediator = MediatorFactory.create();
  }
  return _mediator;
}

/**
 * Register request handler - O(1)
 */
export function registerHandler<TResponse>(
  requestType: RequestType,
  handler: RequestHandler<IRequest<TResponse>, TResponse>
): void {
  const mediator = ensureMediator();
  mediator.registry.registerHandler(requestType, handler);
}

/**
 * Register notification handler - O(1)
 */
export function registerNotificationHandler(
  notificationType: NotificationType,
  handler: NotificationHandler<INotification>
): void {
  const mediator = ensureMediator();
  mediator.registry.registerNotificationHandler(notificationType, handler);
}

/**
 * Register request class - O(1)
 */
export function registerRequestClass(requestClass: RequestClassConstructor): void {
  const mediator = ensureMediator();
  mediator.registry.registerRequestClass(requestClass);
}

/**
 * Register notification class - O(1)
 */
export function registerNotificationClass(notificationClass: NotificationClassConstructor): void {
  const mediator = ensureMediator();
  mediator.registry.registerNotificationClass(notificationClass);
}

/**
 * Create request instance - O(1)
 */
export function createRequestFromData<T extends IRequest<any>>(
  requestType: RequestType, 
  data: any
): T | null {
  const mediator = ensureMediator();
  return mediator.registry.createRequest(requestType, data) as T;
}

/**
 * Create notification instance - O(1)
 */
export function createNotificationFromData<T extends INotification>(
  notificationType: NotificationType, 
  data: any
): T | null {
  const mediator = ensureMediator();
  return mediator.registry.createNotification(notificationType, data) as T;
}

/**
 * Batch registration - O(n)
 */
export function registerBatch(registrations: {
  handlers?: Array<{ type: RequestType; handler: RequestHandler<any, any> }>;
  notificationHandlers?: Array<{ type: NotificationType; handler: NotificationHandler<any> }>;
  requestClasses?: RequestClassConstructor[];
  notificationClasses?: NotificationClassConstructor[];
}): void {
  const mediator = ensureMediator();

  registrations.handlers?.forEach(({ type, handler }) => 
    mediator.registry.registerHandler(type, handler)
  );
  registrations.notificationHandlers?.forEach(({ type, handler }) => 
    mediator.registry.registerNotificationHandler(type, handler)
  );
  registrations.requestClasses?.forEach(cls => 
    mediator.registry.registerRequestClass(cls)
  );
  registrations.notificationClasses?.forEach(cls => 
    mediator.registry.registerNotificationClass(cls)
  );
}

/**
 * Get registry stats - O(1)
 */
export function getRegistryStats(): RegistryStats {
  const mediator = ensureMediator();
  return mediator.registry.getStats();
}

/**
 * Reset registry - O(n)
 */
export function resetRegistry(): void {
  MediatorFactory.reset();
  _mediator = null;
}

/**
 * Send batch requests - O(n)
 */
export async function sendBatch<TResponse>(
  requests: (IQuery<TResponse> | ICommand<TResponse>)[]
): Promise<Result<TResponse>[]> {
  const mediator = ensureMediator();
  return mediator.sendBatch(requests);
}

/**
 * Publish batch notifications - O(n)
 */
export async function publishBatch<TNotification extends INotification>(
  notifications: TNotification[]
): Promise<void> {
  const mediator = ensureMediator();
  await mediator.publishBatch(notifications);
}

 