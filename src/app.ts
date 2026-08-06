import express from "express";
import mongoose from "mongoose";
import { config } from "./config.ts";
import { logger } from "./logger/logger.ts";
import cookieParser from "cookie-parser";
import { ApiResponse } from "./utils/apiResponse.ts";
import { asyncHandler } from "./utils/asyncHandler.ts";

const app = express();

app.use(express.json({ limit: "50mb" })); // For JSON
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cookieParser());

import { authRouter } from "./routes/auth.routes.ts";
import { userRouter } from "./routes/user.routes.ts";

app.get('/health', asyncHandler(async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;
  const response = new ApiResponse(
    isDbConnected ? 200 : 503,
    { db: isDbConnected ? "connected" : "disconnected", dbState },
    isDbConnected ? "Server is healthy!" : "Database is not connected"
  );
  res.status(response.statusCode).json(response.toJson());
}));
app.use(`${config.base.baseUrl}/auth`, authRouter);
app.use(`${config.base.baseUrl}/user`, userRouter);

export default logger;
export { app };
