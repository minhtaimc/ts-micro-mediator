import { Result } from 'ts-micro-result';

/**
 * Public interfaces for ts-micro-mediator
 * For user implementation only
 */

export interface IQuery<TResponse> {
  readonly _response?: TResponse;
}

export interface ICommand<TResponse = void> {
  readonly _response?: TResponse;
}

export interface INotification {}

export interface IMediator {
  send<TResponse>(request: IQuery<TResponse> | ICommand<TResponse>): Promise<Result<TResponse>>;
  publish<TNotification extends INotification>(notification: TNotification): Promise<void>;
}

// Public handler types
export type RequestHandler<TRequest extends IQuery<TResponse> | ICommand<TResponse>, TResponse = void> =
  (request: TRequest) => Promise<Result<TResponse>>;
export type NotificationHandler<TNotification extends INotification> =
  (notification: TNotification) => Promise<void>; 