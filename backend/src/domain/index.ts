// Export all domain components
export * from './entities';
export * from './value-object';
export * from './errors/domain-errors';
export * from './events/domain-event';
export * from './validation/validation-rules';

// Re-export commonly used types
export type { DomainEvent, DomainEventHandler, DomainEventBus } from './events/domain-event';
export type { Result, Success, Failure } from './types/result';
export { success, failure, isSuccess, isFailure, unwrap, unwrapOr } from './types/result';
export type { ValidationRule, ValidationResult } from './validation/validation-rules';
export { validateWithRules, createValidationChain } from './validation/validation-rules';
