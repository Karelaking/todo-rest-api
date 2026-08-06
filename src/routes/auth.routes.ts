import { Router } from "express";
import { AuthController } from "../controllers/auth.controllers.ts";
import { authMiddleware } from "../middlewares/auth.middlewares.ts";

export const authRouter = Router();

const authController = new AuthController();

authRouter.route("/login").post(authController.login);
authRouter.route("/register").post(authController.register);
authRouter.route("/logout").post(authMiddleware, authController.logout);
authRouter.route("/delete").delete(authMiddleware, authController.delete);
authRouter
  .route("/refreshToken")
  .patch(authMiddleware, authController.refreshToken);
