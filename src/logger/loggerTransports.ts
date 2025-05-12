import winston from "winston";
import { join } from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { createConsoleFormat, createJsonFormat } from "@/logger/loggerFormatters";
import type { LoggerConfig } from "@/logger/loggerTypes";
import { mkdir, exists } from "fs/promises";

/**
 * Create the appropriate transports based on configuration
 */
export const createTransports = async (config: LoggerConfig) => {
  const transports: winston.transport[] = [];

  // Console transport
  if (config.consoleLogging) {
    transports.push(
      new winston.transports.Console({
        format: createConsoleFormat(),
        level: config.logLevel,
      })
    );
  }

  // File transports with daily rotation
  if (config.fileLogging) {
    // Ensure log directory exists
    if (!(await exists(config.logDirectory))) {
      await mkdir(config.logDirectory, { recursive: true });
    }

    // Regular logs
    const dailyRotateFileTransport = new DailyRotateFile({
      filename: join(config.logDirectory, `%DATE%-${config.serviceId}.log`),
      datePattern: "YYYY-MM-DD",
      maxSize: config.maxFileSize,
      maxFiles: config.maxFiles,
      format: createJsonFormat(),
      level: config.logLevel,
      auditFile: join(config.logDirectory, "audit.json"),
    });

    // Error logs - separate file
    const errorFileTransport = new DailyRotateFile({
      filename: join(
        config.logDirectory,
        `%DATE%-${config.serviceId}-error.log`
      ),
      datePattern: "YYYY-MM-DD",
      maxSize: config.maxFileSize,
      maxFiles: config.maxFiles,
      level: "error",
      format: createJsonFormat(),
      auditFile: join(config.logDirectory, "error-audit.json"),
    });

    transports.push(dailyRotateFileTransport, errorFileTransport);
  }

  // Elasticsearch transport
  if (config.elasticsearchLogging) {
    try {
      const esTransport = new ElasticsearchTransport({
        level: config.elasticsearchOptions.level,
        clientOpts: config.elasticsearchOptions.clientOpts,
        indexPrefix: config.elasticsearchOptions.indexPrefix,
        indexSuffixPattern: "YYYY.MM.DD",
        source: config.serviceId,
        dataStream: true,
      });

      // Add event listeners to handle transport failures
      esTransport.on("error", (error) => {
        console.error("ElasticsearchTransport error:", error);
      });

      transports.push(esTransport);
    } catch (error) {
      console.error("Failed to initialize Elasticsearch transport:", error);
    }
  }

  return transports;
};
