import { Router } from "express";
import { AuthController } from "@/controllers/auth.controllers";

export const userRouter = Router();

const authController = new AuthController();

userRouter.route("/register").post(authController.register);
userRouter.route("/login").post(authController.login);
userRouter.route("/logout").post(authController.logout);
userRouter.route("/delete").delete(authController.delete);
