import { defineErrorAdvanced } from 'ts-micro-result';

export const MEDIATOR_ERRORS = {
  HANDLER_NOT_FOUND: defineErrorAdvanced('HANDLER_NOT_FOUND', 'Handler not found for request type: {requestType}', 404),
  HANDLER_ERROR: defineErrorAdvanced('HANDLER_ERROR', 'Handler execution failed for request type: {requestType}', 500),
  INVALID_HANDLER_RESULT: defineErrorAdvanced('INVALID_HANDLER_RESULT', 'Handler returned invalid result for request type: {requestType}', 500)
}; 