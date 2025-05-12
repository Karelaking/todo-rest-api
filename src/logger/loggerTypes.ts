export interface LoggerConfig {
  logLevel: string;
  logDirectory: string;
  serviceId: string;
  environment: string;
  consoleLogging: boolean;
  fileLogging: boolean;
  maxFileSize: string;
  maxFiles: string;
  elasticsearchLogging: boolean;
  elasticsearchOptions: {
    level: string;
    clientOpts: {
      node: string;
      auth?: {
        username: string;
        password: string;
      };
    };
    indexPrefix: string;
  };
}

export interface LogContext {
  [key: string]: any;
  traceId?: string;
  userId?: string;
  requestId?: string;
}

export interface LoggerInstance {
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  http(message: string, meta?: any): void;
  verbose(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  silly(message: string, meta?: any): void;
  createChild(context?: LogContext): LoggerInstance;
}

export interface RequestWithLogger extends Request {
  logger: LoggerInstance;
  id?: string;
  user?: {
    id: string;
    [key: string]: any;
  };
}
