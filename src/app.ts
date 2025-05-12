import express from "express";
import { config } from "@/config";
import { logger } from "@/logger/logger";

export const app = express();

app.use(express.json(
  { limit: '50mb' }
));        // For JSON
app.use(express.urlencoded({ extended: true })); // For form data

import { userRouter } from "@/routes/auth.routes";

app.use(`${config.baseUrl}/auth`, userRouter);

export default  logger;


