import { Router } from "express";
import { AuthController } from "@/controllers/auth.controllers";
import { authMiddleware } from "@/middlewares/auth.middlewares";

export const authRouter = Router();

const authController = new AuthController();

authRouter.route("/login").post(authController.login);
authRouter.route("/register").post(authController.register);
authRouter.route("/logout").post(authMiddleware, authController.logout);
authRouter.route("/delete").delete(authMiddleware, authController.delete);
authRouter
  .route("/refreshToken")
  .patch(authMiddleware, authController.refreshToken);
