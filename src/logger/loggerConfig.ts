import type { LoggerConfig } from "@/logger/loggerTypes";

/**
 * Default configuration with environment variable overrides
 */
export const getLoggerConfig = (): LoggerConfig => {
  return {
    // General settings
    logLevel: process.env.LOG_LEVEL || "info",
    logDirectory: process.env.LOG_DIRECTORY || "logs",
    serviceId: process.env.SERVICE_ID || "app",
    environment: process.env.NODE_ENV || process.env.BUN_ENV || "development",

    // Console settings
    consoleLogging: process.env.CONSOLE_LOGGING !== "false",

    // File settings
    fileLogging: process.env.FILE_LOGGING !== "false",
    maxFileSize: process.env.MAX_FILE_SIZE || "50m",
    maxFiles: process.env.MAX_FILES || "14d",

    // Elasticsearch settings (optional)
    elasticsearchLogging: process.env.ELASTICSEARCH_LOGGING === "true",
    elasticsearchOptions: {
      level: process.env.ELASTICSEARCH_LOG_LEVEL || "info",
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
        auth: process.env.ELASTICSEARCH_AUTH
          ? {
              username: process.env.ELASTICSEARCH_USERNAME || "elastic",
              password: process.env.ELASTICSEARCH_PASSWORD || "changeme",
            }
          : undefined,
      },
      indexPrefix: process.env.ELASTICSEARCH_INDEX_PREFIX || "logs",
    },
  };
};
