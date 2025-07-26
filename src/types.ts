import { Result } from 'ts-micro-result';

/**
 * Internal interfaces and types for edge-optimized Mediator
 * Minimal overhead, type-safe
 */

// Stats type definition
export interface RegistryStats {
  requestHandlers: number;
  notificationHandlers: number;
  requestClasses: number;
  notificationClasses: number;
}

// Class constructor types
export type RequestClassConstructor<T extends IRequest<any> = IRequest<any>> = new (...args: any[]) => T;
export type NotificationClassConstructor<T extends INotification = INotification> = new (...args: any[]) => T;

// Internal base interface (not exported)
export interface IRequest<TResponse = void> {
  readonly _response?: TResponse;
}

// Public interfaces for users
export interface IQuery<TResponse> extends IRequest<TResponse> {}
export interface ICommand<TResponse = void> extends IRequest<TResponse> {}
export interface INotification {}

/**
 * Handler types
 */
export type RequestHandler<TRequest extends IRequest<TResponse>, TResponse = void> = 
  (request: TRequest) => Promise<Result<TResponse>>;
export type NotificationHandler<TNotification extends INotification> = 
  (notification: TNotification) => Promise<void>;

export interface IMediator {
  send<TResponse>(request: IRequest<TResponse>): Promise<Result<TResponse>>;
  publish<TNotification extends INotification>(notification: TNotification): Promise<void>;
  getStats(): RegistryStats;
  sendBatch<TResponse>(requests: IRequest<TResponse>[]): Promise<Result<TResponse>[]>;
  publishBatch<TNotification extends INotification>(notifications: TNotification[]): Promise<void>;
  get registry(): IRegistry;
}

export type RequestType = string;
export type NotificationType = string;

/**
 * Registry interface
 */
export interface IRegistry {
  registerHandler<TResponse>(
    requestType: RequestType,
    handler: RequestHandler<IRequest<TResponse>, TResponse>
  ): void;
  registerNotificationHandler(
    notificationType: NotificationType,
    handler: NotificationHandler<INotification>
  ): void;
  getHandler(requestType: RequestType): RequestHandler<any, any> | undefined;
  getNotificationHandlers(notificationType: NotificationType): NotificationHandler<any>[];
  registerRequestClass(requestClass: RequestClassConstructor): void;
  registerNotificationClass(notificationClass: NotificationClassConstructor): void;
  createRequest(requestType: RequestType, data: any): IRequest<any> | null;
  createNotification(notificationType: NotificationType, data: any): INotification | null;
  reset(): void;
  getStats(): RegistryStats;
} 