// ==============================================================================
// core/utils/error.ts
// Standardized Enterprise Error Taxonomy & Friendly Error Formatting
// ==============================================================================
import { logger } from "@core/services/logger.service";

/** Error Severity classification */
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/** Base Domain & Application Error */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly isOperational: boolean;
  public readonly details?: unknown;
  public readonly userMessage: string;

  constructor(options: {
    message: string;
    code?: string;
    statusCode?: number;
    severity?: ErrorSeverity;
    isOperational?: boolean;
    details?: unknown;
    userMessage?: string;
  }) {
    super(options.message);
    this.name = this.constructor.name;
    this.code = options.code ?? "INTERNAL_ERROR";
    this.statusCode = options.statusCode ?? 500;
    this.severity = options.severity ?? "medium";
    this.isOperational = options.isOperational ?? true;
    this.details = options.details;
    this.userMessage =
      options.userMessage ??
      "An unexpected error occurred. Please try again or contact support.";

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** 400 Bad Request / Invalid API Payload */
export class ApiError extends AppError {
  constructor(message: string, code = "API_ERROR", statusCode = 400, details?: unknown) {
    super({
      message,
      code,
      statusCode,
      severity: "medium",
      details,
      userMessage: "The request could not be processed. Please check your data.",
    });
  }
}

/** 401 Unauthorized — Authentication Required */
export class AuthError extends AppError {
  constructor(message = "Authentication required", details?: unknown) {
    super({
      message,
      code: "UNAUTHORIZED",
      statusCode: 401,
      severity: "high",
      details,
      userMessage: "Your session has expired or you are not logged in. Please log in to continue.",
    });
  }
}

/** 403 Forbidden — Insufficient Permissions */
export class PermissionError extends AppError {
  constructor(message = "Access denied", details?: unknown) {
    super({
      message,
      code: "FORBIDDEN",
      statusCode: 403,
      severity: "high",
      details,
      userMessage: "You do not have permission to perform this action or access this resource.",
    });
  }
}

/** 422 Unprocessable Entity / Form Validation Failure */
export class ValidationError extends AppError {
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(message = "Validation failed", fieldErrors?: Record<string, string[]>) {
    super({
      message,
      code: "VALIDATION_ERROR",
      statusCode: 422,
      severity: "low",
      details: fieldErrors,
      userMessage: "Please correct the highlighted errors in the form before submitting.",
    });
    this.fieldErrors = fieldErrors;
  }
}

/** File Upload Error */
export class UploadError extends AppError {
  constructor(message: string, details?: unknown) {
    super({
      message,
      code: "UPLOAD_ERROR",
      statusCode: 400,
      severity: "medium",
      details,
      userMessage: "Failed to upload the file. Please ensure it meets size and type restrictions.",
    });
  }
}

/** Offline / Network Failure */
export class NetworkError extends AppError {
  constructor(message = "Network connectivity lost", details?: unknown) {
    super({
      message,
      code: "NETWORK_ERROR",
      statusCode: 0,
      severity: "high",
      details,
      userMessage: "Network connection lost. Please check your internet connection and try again.",
    });
  }
}

/**
 * Supabase & Postgres SQL Error Code Map -> Friendly Messages
 */
const POSTGRES_ERROR_MAP: Record<string, { code: string; userMessage: string; statusCode: number }> = {
  "23505": {
    code: "DUPLICATE_RECORD",
    userMessage: "A record with this information already exists.",
    statusCode: 409,
  },
  "23503": {
    code: "FOREIGN_KEY_VIOLATION",
    userMessage: "This operation references a item that no longer exists.",
    statusCode: 400,
  },
  "42501": {
    code: "PERMISSION_DENIED",
    userMessage: "You do not have permission to modify this data.",
    statusCode: 403,
  },
  PGRST116: {
    code: "NOT_FOUND",
    userMessage: "The requested item could not be found.",
    statusCode: 404,
  },
  PGRST301: {
    code: "TOKEN_EXPIRED",
    userMessage: "Your authentication token has expired. Please refresh or log in again.",
    statusCode: 401,
  },
};

/**
 * Normalizes any thrown error value into a strongly-typed AppError instance
 * without exposing raw backend stack traces or internal secrets to end users.
 */
export function toAppError(error: unknown, fallbackMessage = "An unexpected error occurred"): AppError {
  if (error instanceof AppError) {
    return error;
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    // Check if offline/network error
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return new NetworkError(error.message);
    }

    return new AppError({
      message: error.message,
      userMessage: fallbackMessage,
      details: error.stack,
    });
  }

  // Handle Supabase/PostgreSQL error objects
  if (typeof error === "object" && error !== null) {
    const errObj = error as { code?: string; message?: string; details?: unknown; status?: number };
    if (errObj.code && errObj.code in POSTGRES_ERROR_MAP) {
      const mapped = POSTGRES_ERROR_MAP[errObj.code]!;
      return new AppError({
        message: errObj.message ?? mapped.userMessage,
        code: mapped.code,
        statusCode: mapped.statusCode,
        userMessage: mapped.userMessage,
        details: errObj.details,
      });
    }

    if (errObj.status === 401) {
      return new AuthError(errObj.message);
    }
    if (errObj.status === 403) {
      return new PermissionError(errObj.message);
    }

    return new AppError({
      message: errObj.message ?? "API error",
      statusCode: errObj.status ?? 500,
      userMessage: fallbackMessage,
      details: errObj.details,
    });
  }

  return new AppError({
    message: String(error),
    userMessage: fallbackMessage,
  });
}

/**
 * Returns a user-safe display message from any error value.
 * Logs the error silently in logger service.
 */
export function getFriendlyErrorMessage(error: unknown, context?: string): string {
  const appError = toAppError(error);

  // Log unexpected or critical errors automatically
  if (appError.statusCode >= 500 || appError.severity === "critical" || appError.severity === "high") {
    logger.error(`[${context ?? "ErrorHandler"}] ${appError.message}`, appError, {
      code: appError.code,
      statusCode: appError.statusCode,
    });
  }

  return appError.userMessage;
}
