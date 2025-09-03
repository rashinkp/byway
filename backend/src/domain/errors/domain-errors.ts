// Base domain error class
export abstract class DomainError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// User-related domain errors
export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`, 'USER_NOT_FOUND');
  }
}

export class UserValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'USER_VALIDATION_ERROR');
  }
}

export class UserAuthenticationError extends DomainError {
  constructor(message: string) {
    super(message, 'USER_AUTHENTICATION_ERROR');
  }
}

export class UserAuthorizationError extends DomainError {
  constructor(message: string) {
    super(message, 'USER_AUTHORIZATION_ERROR');
  }
}

// Course-related domain errors
export class CourseNotFoundError extends DomainError {
  constructor(courseId: string) {
    super(`Course with ID ${courseId} not found`, 'COURSE_NOT_FOUND');
  }
}

export class CourseValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'COURSE_VALIDATION_ERROR');
  }
}

export class CourseApprovalError extends DomainError {
  constructor(message: string) {
    super(message, 'COURSE_APPROVAL_ERROR');
  }
}

// Lesson-related domain errors
export class LessonNotFoundError extends DomainError {
  constructor(lessonId: string) {
    super(`Lesson with ID ${lessonId} not found`, 'LESSON_NOT_FOUND');
  }
}

export class LessonValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'LESSON_VALIDATION_ERROR');
  }
}

// Category-related domain errors
export class CategoryNotFoundError extends DomainError {
  constructor(categoryId: string) {
    super(`Category with ID ${categoryId} not found`, 'CATEGORY_NOT_FOUND');
  }
}

export class CategoryValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'CATEGORY_VALIDATION_ERROR');
  }
}

// Cart-related domain errors
export class CartValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'CART_VALIDATION_ERROR');
  }
}

export class CartItemNotFoundError extends DomainError {
  constructor(itemId: string) {
    super(`Cart item with ID ${itemId} not found`, 'CART_ITEM_NOT_FOUND');
  }
}

// Order-related domain errors
export class OrderNotFoundError extends DomainError {
  constructor(orderId: string) {
    super(`Order with ID ${orderId} not found`, 'ORDER_NOT_FOUND');
  }
}

export class OrderValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'ORDER_VALIDATION_ERROR');
  }
}

export class OrderStateError extends DomainError {
  constructor(message: string) {
    super(message, 'ORDER_STATE_ERROR');
  }
}

// Payment-related domain errors
export class PaymentError extends DomainError {
  constructor(message: string) {
    super(message, 'PAYMENT_ERROR');
  }
}

export class PaymentValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'PAYMENT_VALIDATION_ERROR');
  }
}

// Wallet-related domain errors
export class WalletError extends DomainError {
  constructor(message: string) {
    super(message, 'WALLET_ERROR');
  }
}

export class InsufficientFundsError extends DomainError {
  constructor(required: number, available: number) {
    super(`Insufficient funds. Required: ${required}, Available: ${available}`, 'INSUFFICIENT_FUNDS');
  }
}

// Content-related domain errors
export class ContentNotFoundError extends DomainError {
  constructor(contentId: string) {
    super(`Content with ID ${contentId} not found`, 'CONTENT_NOT_FOUND');
  }
}

export class ContentValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'CONTENT_VALIDATION_ERROR');
  }
}

// Generic validation error
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

// Generic not found error
export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`, 'NOT_FOUND');
  }
}

// Generic business rule violation error
export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(message, 'BUSINESS_RULE_VIOLATION');
  }
}
