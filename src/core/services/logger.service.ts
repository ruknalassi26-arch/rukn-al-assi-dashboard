// ==============================================================================
// core/services/logger.service.ts
// Centralized enterprise logging service
// Production-ready for integration with Sentry, LogRocket, Datadog, etc.
// ==============================================================================

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogContext {
  userId?: string;
  userRole?: string;
  locale?: string;
  path?: string;
  component?: string;
  action?: string;
  [key: string]: unknown;
}

export interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    details?: unknown;
  };
  context?: LogContext;
}

class LoggerService {
  private static instance: LoggerService;
  private isDevelopment = process.env.NODE_ENV === "development";

  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  /**
   * Internal formatter for log entries
   */
  private formatPayload(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext
  ): LogPayload {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (error) {
      if (error instanceof Error) {
        payload.error = {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: (error as { code?: string }).code,
          details: (error as { details?: unknown }).details,
        };
      } else {
        payload.error = {
          name: "UnknownError",
          message: String(error),
          details: error,
        };
      }
    }

    return payload;
  }

  /**
   * Dispatches log to external telemetry services (e.g., Sentry, LogRocket)
   */
  private dispatchToRemote(_payload: LogPayload): void {
    if (this.isDevelopment) return;

    // Ready for Sentry / LogRocket integration:
    // if (typeof window !== "undefined" && (window as any).Sentry) {
    //   (window as any).Sentry.captureException(payload.error || payload.message, { extra: payload.context });
    // }
  }

  public debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const payload = this.formatPayload("debug", message, undefined, context);
      console.debug(`[DEBUG] ${payload.timestamp} - ${message}`, context ?? "");
    }
  }

  public info(message: string, context?: LogContext): void {
    const payload = this.formatPayload("info", message, undefined, context);
    console.info(`[INFO] ${payload.timestamp} - ${message}`, context ?? "");
    this.dispatchToRemote(payload);
  }

  public warn(message: string, error?: unknown, context?: LogContext): void {
    const payload = this.formatPayload("warn", message, error, context);
    console.warn(`[WARN] ${payload.timestamp} - ${message}`, payload.error ?? "", context ?? "");
    this.dispatchToRemote(payload);
  }

  public error(message: string, error?: unknown, context?: LogContext): void {
    const payload = this.formatPayload("error", message, error, context);
    console.error(`[ERROR] ${payload.timestamp} - ${message}`, payload.error ?? "", context ?? "");
    this.dispatchToRemote(payload);
  }

  public fatal(message: string, error?: unknown, context?: LogContext): void {
    const payload = this.formatPayload("fatal", message, error, context);
    console.error(`[FATAL] ${payload.timestamp} - ${message}`, payload.error ?? "", context ?? "");
    this.dispatchToRemote(payload);
  }
}

export const logger = LoggerService.getInstance();
