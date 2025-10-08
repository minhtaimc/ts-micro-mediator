import { 
  IRequest,
  ICommand,
  IQuery, 
  INotification, 
  IMediator,
  IRegistry,
  RequestType,
  NotificationType,
  RegistryStats
} from './types.js';
import { Registry } from './registry.js';
import { Result, err } from 'ts-micro-result';
import { MEDIATOR_ERRORS } from './mediator-errors.js';

/**
 * Edge-optimized Mediator
 * Minimal memory footprint, fast execution
 */
export class Mediator implements IMediator {
  private readonly _registry: Registry;

  constructor(registry: Registry) {
    this._registry = registry;
  }

  /**
   * Registry instance for internal operations
   */
  get registry(): IRegistry {
    return this._registry;
  }

  /**
   * Send command - O(1) lookup + execution - CQRS Pattern
   */
  async sendCommand<TResponse>(command: ICommand<TResponse>): Promise<Result<TResponse>> {
    return this.send(command);
  }

  /**
   * Send query - O(1) lookup + execution - CQRS Pattern
   */
  async sendQuery<TResponse>(query: IQuery<TResponse>): Promise<Result<TResponse>> {
    return this.send(query);
  }

  /**
   * Send request - O(1) lookup + execution - Generic (backward compatibility)
   */
  async send<TResponse>(request: IRequest<TResponse>): Promise<Result<TResponse>> {
    const requestType = this.getRequestType(request);
    const handler = this._registry.getHandler(requestType);

    if (!handler) {
      return err(MEDIATOR_ERRORS.HANDLER_NOT_FOUND(requestType));
    }

    try {
      const result = await handler(request);
      return result?.ok !== undefined ? result : err(MEDIATOR_ERRORS.INVALID_HANDLER_RESULT(requestType));
    } catch {
      return err(MEDIATOR_ERRORS.HANDLER_ERROR(requestType));
    }
  }

  /**
   * Publish notification - O(n) handlers
   */
  async publish<TNotification extends INotification>(notification: TNotification): Promise<void> {
    const handlers = this._registry.getNotificationHandlers(this.getNotificationType(notification));
    if (handlers.length > 0) {
      await Promise.all(handlers.map(handler => handler(notification).catch(() => {})));
    }
  }

  /**
   * Batch send commands - O(n) - CQRS Pattern
   */
  async sendCommandBatch<TResponse>(commands: ICommand<TResponse>[]): Promise<Result<TResponse>[]> {
    return Promise.all(commands.map(command => this.sendCommand(command)));
  }

  /**
   * Batch send queries - O(n) - CQRS Pattern
   */
  async sendQueryBatch<TResponse>(queries: IQuery<TResponse>[]): Promise<Result<TResponse>[]> {
    return Promise.all(queries.map(query => this.sendQuery(query)));
  }

  /**
   * Batch send requests - O(n) - Generic (backward compatibility)
   */
  async sendBatch<TResponse>(requests: IRequest<TResponse>[]): Promise<Result<TResponse>[]> {
    return Promise.all(requests.map(request => this.send(request)));
  }

  /**
   * Batch publish notifications - O(n*m)
   */
  async publishBatch<TNotification extends INotification>(notifications: TNotification[]): Promise<void> {
    await Promise.all(notifications.map(notification => this.publish(notification).catch(() => {})));
  }

  /**
   * Get request type - O(1)
   */
  private getRequestType(request: IRequest<any>): RequestType {
    return request.constructor.name;
  }

  /**
   * Get notification type - O(1)
   */
  private getNotificationType(notification: INotification): NotificationType {
    return notification.constructor.name;
  }

  /**
   * Get mediator stats
   */
  getStats(): RegistryStats {
    return this._registry.getStats();
  }
}

// Global singleton instance
let _instance: Mediator | null = null;
let _registry: Registry | null = null;

/**
 * Optimized Factory - Simplified for edge computing
 */
export class MediatorFactory {
  static create(): Mediator {
    if (!_instance) {
      _registry = new Registry();
      _instance = new Mediator(_registry);
    }
    return _instance;
  }

  static createWithRegistry(registry: Registry): Mediator {
    return new Mediator(registry);
  }

  static reset(): void {
    if (_registry) {
      _registry.reset();
    }
    _instance = null;
    _registry = null;
  }

  static getRegistry(): Registry | null {
    return _registry;
  }
} 