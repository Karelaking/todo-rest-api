import { Error } from "mongoose";

class ApiError extends Error {
  statusCode: number;
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: string[] = [],
    stack: string = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.stack = stack;
    this.cause = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
