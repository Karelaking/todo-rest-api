import express from "express";
import { config } from "@/config";
import { logger } from "@/logger/logger";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json({ limit: "50mb" })); // For JSON
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cookieParser());

import { authRouter } from "@/routes/auth.routes";
import { userRouter } from "@/routes/user.routes";

app.use(`${config.base.baseUrl}/auth`, authRouter);
app.use(`${config.base.baseUrl}/user`, userRouter);

export default logger;
