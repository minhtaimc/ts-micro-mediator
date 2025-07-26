import { 
  IRequest, 
  RequestHandler, 
  INotification, 
  NotificationHandler,
  IRegistry,
  RequestType,
  NotificationType,
  RegistryStats,
  RequestClassConstructor,
  NotificationClassConstructor
} from './types.js';

/**
 * Edge-optimized Registry
 * Minimal memory footprint, fast lookups
 */
export class Registry implements IRegistry {
  private readonly requestHandlers = new Map<RequestType, RequestHandler<any, any>>();
  private readonly notificationHandlers = new Map<NotificationType, NotificationHandler<any>[]>();
  private readonly requestClasses = new Map<RequestType, RequestClassConstructor>();
  private readonly notificationClasses = new Map<NotificationType, NotificationClassConstructor>();

  /**
   * Register request handler - O(1)
   */
  registerHandler<TResponse>(
    requestType: RequestType,
    handler: RequestHandler<IRequest<TResponse>, TResponse>
  ): void {
    this.requestHandlers.set(requestType, handler);
  }

  /**
   * Register notification handler - O(1)
   */
  registerNotificationHandler(
    notificationType: NotificationType,
    handler: NotificationHandler<INotification>
  ): void {
    const handlers = this.notificationHandlers.get(notificationType);
    handlers ? handlers.push(handler) : this.notificationHandlers.set(notificationType, [handler]);
  }

  /**
   * Register request class - O(1)
   */
  registerRequestClass(requestClass: RequestClassConstructor): void {
    const requestType = requestClass.name;
    this.requestClasses.set(requestType, requestClass);
  }

  /**
   * Register notification class - O(1)
   */
  registerNotificationClass(notificationClass: NotificationClassConstructor): void {
    const notificationType = notificationClass.name;
    this.notificationClasses.set(notificationType, notificationClass);
  }

  /**
   * Get request handler - O(1)
   */
  getHandler(requestType: RequestType): RequestHandler<any, any> | undefined {
    return this.requestHandlers.get(requestType);
  }

  /**
   * Get notification handlers - O(1)
   */
  getNotificationHandlers(notificationType: NotificationType): NotificationHandler<any>[] {
    return this.notificationHandlers.get(notificationType) || [];
  }

  /**
   * Create request instance - O(1)
   */
  createRequest(requestType: RequestType, data: any): IRequest<any> | null {
    const RequestClass = this.requestClasses.get(requestType);
    return RequestClass ? new RequestClass(data) : null;
  }

  /**
   * Create notification instance - O(1)
   */
  createNotification(notificationType: NotificationType, data: any): INotification | null {
    const NotificationClass = this.notificationClasses.get(notificationType);
    return NotificationClass ? new NotificationClass(data) : null;
  }

  /**
   * Reset registry - O(n)
   */
  reset(): void {
    this.requestHandlers.clear();
    this.notificationHandlers.clear();
    this.requestClasses.clear();
    this.notificationClasses.clear();
  }

  /**
   * Get registry stats - O(1)
   */
  getStats(): RegistryStats {
    return {
      requestHandlers: this.requestHandlers.size,
      notificationHandlers: this.notificationHandlers.size,
      requestClasses: this.requestClasses.size,
      notificationClasses: this.notificationClasses.size
    };
  }
} 