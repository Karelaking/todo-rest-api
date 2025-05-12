import winston from "winston";
const { format } = winston;
/**
 * Human-readable formatter for console output
 */
export const createConsoleFormat = () => {
  return format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),
    format.errors({ stack: true }),
    format.metadata({
      fillExcept: ["message", "level", "timestamp", "label"],
    }),
    format.colorize(),
    format.printf((info) => {
      const { timestamp, level, message, metadata, ...rest } = info;

      const contextInfo =
        Object.keys(rest).length > 0 ? ` ${JSON.stringify(rest)}` : "";

      return `${timestamp} ${level}: ${message}${contextInfo}`;
    })
  );
};

/**
 * Machine-readable JSON formatter for file logs and external services
 */
export const createJsonFormat = () => {
  return format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.metadata(),
    format.json()
  );
};
