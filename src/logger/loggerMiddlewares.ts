import type { LoggerInstance, RequestWithLogger } from "@/logger/loggerTypes";

/**
 * Express/Bun middleware for automatic request logging
 */
export const createRequestMiddleware = (logger: LoggerInstance) => {
  return (req: any, res: any, next: Function) => {
    // Generate trace ID from header or create new one
    const traceId =
      req.headers["x-trace-id"] ||
      `trace-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Extract user ID if available
    const userId = req.user?.id || req.headers["x-user-id"] || "anonymous";

    // Create request-specific logger with trace context
    req.logger = logger.createChild({
      traceId,
      userId,
      requestId: req.id || traceId,
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection?.remoteAddress,
    });

    // Log request start
    req.logger.info(
      `Request started: ${req.method} ${req.originalUrl || req.url}`
    );

    // Record start time
    const start = Date.now();

    // Intercept response to log when completed
    const originalEnd = res.end;
    res.end = function (...args: any[]) {
      // Calculate request duration
      const duration = Date.now() - start;

      // Log request completion
      req.logger.info(
        `Request completed: ${req.method} ${req.originalUrl || req.url}`,
        {
          statusCode: res.statusCode,
          duration: `${duration}ms`,
        }
      );

      // Restore and call original end method
      res.end = originalEnd;
      return res.end(...args);
    };

    next();
  };
};

/**
 * Express/Bun middleware for error logging
 */
export const createErrorMiddleware = (logger: LoggerInstance) => {
  return (
    err: Error & { statusCode?: number },
    req: any,
    res: any,
    next: Function
  ) => {
    const errorLogger = req.logger || logger;

    errorLogger.error("Express error:", {
      error: err.message,
      stack: err.stack,
      statusCode: err.statusCode || 500,
    });

    next(err);
  };
};
