import { DomainError } from "../../domain/errors/domain-errors";

// Error mapping interface
export interface ErrorMapping {
  statusCode: number;
  message: string;
  code: string;
}

// Map domain errors to HTTP responses
export const mapDomainErrorToHttpResponse = (error: DomainError): ErrorMapping => {
  const errorCode = error.code;
  
  switch (errorCode) {
    // User-related errors
    case 'USER_NOT_FOUND':
      return { statusCode: 404, message: error.message, code: errorCode };
    case 'USER_VALIDATION_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    case 'USER_AUTHENTICATION_ERROR':
      return { statusCode: 401, message: error.message, code: errorCode };
    case 'USER_AUTHORIZATION_ERROR':
      return { statusCode: 403, message: error.message, code: errorCode };
    
    // Course-related errors
    case 'COURSE_NOT_FOUND':
      return { statusCode: 404, message: error.message, code: errorCode };
    case 'COURSE_VALIDATION_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    case 'COURSE_APPROVAL_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    
    // Lesson-related errors
    case 'LESSON_NOT_FOUND':
      return { statusCode: 404, message: error.message, code: errorCode };
    case 'LESSON_VALIDATION_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    
    // Category-related errors
    case 'CATEGORY_NOT_FOUND':
      return { statusCode: 404, message: error.message, code: errorCode };
    case 'CATEGORY_VALIDATION_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    
    // Cart-related errors
    case 'CART_VALIDATION_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    case 'CART_ITEM_NOT_FOUND':
      return { statusCode: 404, message: error.message, code: errorCode };
    
    // Order-related errors
    case 'ORDER_NOT_FOUND':
      return { statusCode: 404, message: error.message, code: errorCode };
    case 'ORDER_VALIDATION_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    case 'ORDER_STATE_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    
    // Payment-related errors
    case 'PAYMENT_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    case 'PAYMENT_VALIDATION_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    
    // Wallet-related errors
    case 'WALLET_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    case 'INSUFFICIENT_FUNDS':
      return { statusCode: 400, message: error.message, code: errorCode };
    
    // Content-related errors
    case 'CONTENT_NOT_FOUND':
      return { statusCode: 404, message: error.message, code: errorCode };
    case 'CONTENT_VALIDATION_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    
    // Generic errors
    case 'VALIDATION_ERROR':
      return { statusCode: 400, message: error.message, code: errorCode };
    case 'NOT_FOUND':
      return { statusCode: 404, message: error.message, code: errorCode };
    case 'BUSINESS_RULE_VIOLATION':
      return { statusCode: 400, message: error.message, code: errorCode };
    
    // Default case
    default:
      return { statusCode: 500, message: 'Internal server error', code: 'INTERNAL_ERROR' };
  }
};

// Helper function to check if error is a domain error
export const isDomainError = (error: unknown): error is DomainError => {
  return error instanceof Error && 'code' in error;
};

// Helper function to handle errors in use cases
export const handleUseCaseError = (error: unknown): never => {
  if (isDomainError(error)) {
    throw error; // Re-throw domain errors as they are
  }
  
  // For non-domain errors, wrap them in a generic domain error
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  throw new Error(message);
};
