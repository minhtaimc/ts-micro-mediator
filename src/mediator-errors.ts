import { ErrorDetail } from 'ts-micro-result';

export const MEDIATOR_ERRORS = {
  HANDLER_NOT_FOUND: (requestType: string): ErrorDetail => ({
    code: 'HANDLER_NOT_FOUND',
    message: `Handler not found for request type: ${requestType}`
  }),
  HANDLER_ERROR: (requestType: string): ErrorDetail => ({
    code: 'HANDLER_ERROR',
    message: `Handler execution failed for request type: ${requestType}`
  }),
  INVALID_HANDLER_RESULT: (requestType: string): ErrorDetail => ({
    code: 'INVALID_HANDLER_RESULT',
    message: `Handler returned invalid result for request type: ${requestType}`
  })
}; 