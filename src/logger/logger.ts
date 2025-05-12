import winston from "winston";
import type { LoggerConfig, LoggerInstance, LogContext } from "@/logger/loggerTypes";
import { getLoggerConfig } from "@/logger/loggerConfig";
import { createTransports } from "@/logger/loggerTransports";
import { createRequestMiddleware, createErrorMiddleware } from "@/logger/loggerMiddlewares";

/**
 * Create a fully configured Winston logger instance
 */
export class Logger implements LoggerInstance {
  private logger: winston.Logger;
  private config: LoggerConfig;

  private constructor(logger: winston.Logger, config: LoggerConfig) {
    this.logger = logger;
    this.config = config;
  }

  /**
   * Initialize and create a logger instance
   */
  public static async create(
    customConfig?: Partial<LoggerConfig>
  ): Promise<Logger> {
    // Merge default config with custom config
    const config = { ...getLoggerConfig(), ...customConfig };

    // Create transports
    const transports = await createTransports(config);

    // Create Winston logger
    const winstonLogger = winston.createLogger({
      level: config.logLevel,
      defaultMeta: {
        service: config.serviceId,
        environment: config.environment,
      },
      transports,
      exitOnError: config.environment !== "production",
    });

    // Create and return our logger instance
    return new Logger(winstonLogger, config);
  }

  /**
   * Log at error level
   */
  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  /**
   * Log at warn level
   */
  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log at info level
   */
  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Log at http level
   */
  http(message: string, meta?: any): void {
    this.logger.http(message, meta);
  }

  /**
   * Log at verbose level
   */
  verbose(message: string, meta?: any): void {
    this.logger.verbose(message, meta);
  }

  /**
   * Log at debug level
   */
  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  /**
   * Log at silly level
   */
  silly(message: string, meta?: any): void {
    this.logger.silly(message, meta);
  }

  /**
   * Create a child logger with additional context
   */
  createChild(context: LogContext = {}): LoggerInstance {
    const childLogger = this.logger.child(context);
    const childInstance = new Logger(childLogger, this.config);
    return childInstance;
  }

  /**
   * Request middleware for Express/Bun
   */
  requestMiddleware() {
    return createRequestMiddleware(this);
  }

  /**
   * Error middleware for Express/Bun
   */
  errorMiddleware() {
    return createErrorMiddleware(this);
  }

  /**
   * Graceful shutdown function
   */
  async shutdown(): Promise<void> {
    return new Promise((resolve) => {
      this.logger.info("Shutting down logger...");
      setTimeout(() => {
        this.logger.end(() => {
          console.log("Logger shutdown complete");
          resolve();
        });
      }, 1000); // Give time for final logs to be written
    });
  }

  /**
   * Setup global unhandled exception and rejection handlers
   */
  setupGlobalHandlers(): void {
    process.on("uncaughtException", (error) => {
      this.error("Uncaught exception", {
        error: error.message,
        stack: error.stack,
      });

      if (this.config.environment !== "production") {
        process.exit(1);
      }
    });

    process.on("unhandledRejection", (reason, promise) => {
      this.error("Unhandled rejection", {
        reason: reason instanceof Error ? reason.message : reason,
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    });
  }
}

export const logger = Logger.create();

