import { DomainError } from "../errors/domain-errors";

// Result type for handling success/failure scenarios
export type Result<T, E = DomainError> = Success<T> | Failure<E>;

// Success result
export class Success<T> {
  readonly _tag = 'Success' as const;
  readonly isSuccess = true;
  readonly isFailure = false;

  constructor(readonly value: T) {}

  map<U>(fn: (value: T) => U): Success<U> {
    return new Success(fn(this.value));
  }

  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, F> {
    return fn(this.value);
  }

  getValue(): T {
    return this.value;
  }
}

// Failure result
export class Failure<E> {
  readonly _tag = 'Failure' as const;
  readonly isSuccess = false;
  readonly isFailure = true;

  constructor(readonly error: E) {}

  map<U>(_fn: (value: never) => U): Failure<E> {
    return this;
  }

  flatMap<U, F>(_fn: (value: never) => Result<U, F>): Failure<E> {
    return this;
  }

  getError(): E {
    return this.error;
  }
}

// Helper functions
export const success = <T>(value: T): Success<T> => new Success(value);
export const failure = <E>(error: E): Failure<E> => new Failure(error);

// Type guards
export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> => 
  result.isSuccess;

export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> => 
  result.isFailure;

// Utility function to unwrap result or throw
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isSuccess(result)) {
    return result.getValue();
  }
  throw result.getError();
};

// Utility function to unwrap result with default value
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  if (isSuccess(result)) {
    return result.getValue();
  }
  return defaultValue;
};
