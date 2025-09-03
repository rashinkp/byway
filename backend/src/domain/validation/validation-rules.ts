// Domain validation rules
export interface ValidationRule<T> {
  validate(value: T): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Base validation rule class
export abstract class BaseValidationRule<T> implements ValidationRule<T> {
  abstract validate(value: T): ValidationResult;

  protected createSuccess(): ValidationResult {
    return { isValid: true, errors: [] };
  }

  protected createFailure(error: string): ValidationResult {
    return { isValid: false, errors: [error] };
  }

  protected createFailureMultiple(errors: string[]): ValidationResult {
    return { isValid: false, errors };
  }
}

// String validation rules
export class RequiredStringRule extends BaseValidationRule<string> {
  validate(value: string): ValidationResult {
    if (!value || value.trim().length === 0) {
      return this.createFailure('Value is required');
    }
    return this.createSuccess();
  }
}

export class StringLengthRule extends BaseValidationRule<string> {
  constructor(
    private minLength: number,
    private maxLength: number
  ) {
    super();
  }

  validate(value: string): ValidationResult {
    if (value.length < this.minLength) {
      return this.createFailure(`Value must be at least ${this.minLength} characters long`);
    }
    if (value.length > this.maxLength) {
      return this.createFailure(`Value must not exceed ${this.maxLength} characters`);
    }
    return this.createSuccess();
  }
}

// Number validation rules
export class RequiredNumberRule extends BaseValidationRule<number> {
  validate(value: number): ValidationResult {
    if (value === null || value === undefined || isNaN(value)) {
      return this.createFailure('Value is required and must be a number');
    }
    return this.createSuccess();
  }
}

export class NumberRangeRule extends BaseValidationRule<number> {
  constructor(
    private min: number,
    private max: number
  ) {
    super();
  }

  validate(value: number): ValidationResult {
    if (value < this.min) {
      return this.createFailure(`Value must be at least ${this.min}`);
    }
    if (value > this.max) {
      return this.createFailure(`Value must not exceed ${this.max}`);
    }
    return this.createSuccess();
  }
}

export class PositiveNumberRule extends BaseValidationRule<number> {
  validate(value: number): ValidationResult {
    if (value <= 0) {
      return this.createFailure('Value must be positive');
    }
    return this.createSuccess();
  }
}

// Email validation rule
export class EmailFormatRule extends BaseValidationRule<string> {
  validate(value: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return this.createFailure('Invalid email format');
    }
    return this.createSuccess();
  }
}

// URL validation rule
export class UrlFormatRule extends BaseValidationRule<string> {
  validate(value: string): ValidationResult {
    try {
      new URL(value);
      return this.createSuccess();
    } catch {
      return this.createFailure('Invalid URL format');
    }
  }
}

// Date validation rules
export class RequiredDateRule extends BaseValidationRule<Date> {
  validate(value: Date): ValidationResult {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) {
      return this.createFailure('Valid date is required');
    }
    return this.createSuccess();
  }
}

export class DateRangeRule extends BaseValidationRule<Date> {
  constructor(
    private minDate: Date,
    private maxDate: Date
  ) {
    super();
  }

  validate(value: Date): ValidationResult {
    if (value < this.minDate) {
      return this.createFailure(`Date must be after ${this.minDate.toISOString()}`);
    }
    if (value > this.maxDate) {
      return this.createFailure(`Date must be before ${this.maxDate.toISOString()}`);
    }
    return this.createSuccess();
  }
}

// Composite validation rule
export class CompositeValidationRule<T> extends BaseValidationRule<T> {
  constructor(private rules: ValidationRule<T>[]) {
    super();
  }

  validate(value: T): ValidationResult {
    const allErrors: string[] = [];
    
    for (const rule of this.rules) {
      const result = rule.validate(value);
      if (!result.isValid) {
        allErrors.push(...result.errors);
      }
    }

    if (allErrors.length > 0) {
      return this.createFailureMultiple(allErrors);
    }

    return this.createSuccess();
  }
}

// Validation helper functions
export const validateWithRules = <T>(
  value: T,
  rules: ValidationRule<T>[]
): ValidationResult => {
  const compositeRule = new CompositeValidationRule(rules);
  return compositeRule.validate(value);
};

export const createValidationChain = <T>(rules: ValidationRule<T>[]): ValidationRule<T> => {
  return new CompositeValidationRule(rules);
};
