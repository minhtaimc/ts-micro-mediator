import { Result, ErrorDetail } from 'ts-micro-result';

function isErrorDetail(value: unknown): value is ErrorDetail {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<ErrorDetail>;
  return typeof candidate.code === 'string' && typeof candidate.message === 'string';
}

/**
 * Runtime guard to verify a value matches ts-micro-result's Result contract.
 * Useful for validating handler outputs or integrating with custom pipelines.
 */
export function isResult(value: unknown): value is Result<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<Result<unknown>>;
  const hasLifecycleGuards =
    typeof candidate.isOk === 'function' &&
    typeof candidate.isError === 'function' &&
    typeof candidate.hasWarning === 'function';

  const hasRequiredFields =
    Object.prototype.hasOwnProperty.call(candidate, 'data') &&
    Array.isArray(candidate.errors) &&
    candidate.errors.every(isErrorDetail);

  return hasLifecycleGuards && hasRequiredFields;
}
