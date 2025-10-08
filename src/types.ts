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
 * Handler types - CQRS Pattern
 */
export type CommandHandler<TCommand extends ICommand<TResponse>, TResponse = void> = 
  (command: TCommand) => Promise<Result<TResponse>>;
export type QueryHandler<TQuery extends IQuery<TResponse>, TResponse = void> = 
  (query: TQuery) => Promise<Result<TResponse>>;
export type RequestHandler<TRequest extends IRequest<TResponse>, TResponse = void> = 
  (request: TRequest) => Promise<Result<TResponse>>;
export type NotificationHandler<TNotification extends INotification> = 
  (notification: TNotification) => Promise<void>;

export interface IMediator {
  // CQRS Pattern - Tách rõ Command và Query
  sendCommand<TResponse>(command: ICommand<TResponse>): Promise<Result<TResponse>>;
  sendQuery<TResponse>(query: IQuery<TResponse>): Promise<Result<TResponse>>;
  
  // Generic send (backward compatibility)
  send<TResponse>(request: IRequest<TResponse>): Promise<Result<TResponse>>;
  
  // Notification
  publish<TNotification extends INotification>(notification: TNotification): Promise<void>;
  
  // Batch operations
  sendCommandBatch<TResponse>(commands: ICommand<TResponse>[]): Promise<Result<TResponse>[]>;
  sendQueryBatch<TResponse>(queries: IQuery<TResponse>[]): Promise<Result<TResponse>[]>;
  sendBatch<TResponse>(requests: IRequest<TResponse>[]): Promise<Result<TResponse>[]>;
  publishBatch<TNotification extends INotification>(notifications: TNotification[]): Promise<void>;
  
  // Stats and registry
  getStats(): RegistryStats;
  get registry(): IRegistry;
}

export type RequestType = string;
export type NotificationType = string;

/**
 * Registry interface - CQRS Pattern
 */
export interface IRegistry {
  // CQRS Pattern - Tách rõ Command và Query handlers
  registerCommandHandler<TCommand extends ICommand<TResponse>, TResponse = void>(
    commandType: RequestType,
    handler: CommandHandler<TCommand, TResponse>
  ): void;
  registerQueryHandler<TQuery extends IQuery<TResponse>, TResponse = void>(
    queryType: RequestType,
    handler: QueryHandler<TQuery, TResponse>
  ): void;
  
  // Generic handler (backward compatibility)
  registerHandler<TResponse>(
    requestType: RequestType,
    handler: RequestHandler<IRequest<TResponse>, TResponse>
  ): void;
  
  // Notification handlers
  registerNotificationHandler(
    notificationType: NotificationType,
    handler: NotificationHandler<INotification>
  ): void;
  
  // Get handlers
  getHandler(requestType: RequestType): RequestHandler<any, any> | undefined;
  getNotificationHandlers(notificationType: NotificationType): NotificationHandler<any>[];
  
  // Register classes
  registerRequestClass(requestClass: RequestClassConstructor): void;
  registerNotificationClass(notificationClass: NotificationClassConstructor): void;
  
  // Factory methods
  createRequest(requestType: RequestType, data: any): IRequest<any> | null;
  createNotification(notificationType: NotificationType, data: any): INotification | null;
  
  // Utility
  reset(): void;
  getStats(): RegistryStats;
} 