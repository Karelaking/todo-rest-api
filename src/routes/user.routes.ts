import { Router } from "express";
import { UserController } from "@/controllers/user.controllers";
import { authMiddleware } from "@/middlewares/auth.middlewares";

export const userRouter = Router();

const userController = new UserController();

// Adding routes
userRouter
  .route("/email")
  .post(authMiddleware, userController.addEmail);
userRouter
  .route("/:avatar")
  .post(authMiddleware, userController.addAvatar);
userRouter
  .route("/:address")
  .post(authMiddleware, userController.addAddress);
userRouter
  .route("/:phoneNumber")
  .post(authMiddleware, userController.addPhoneNumber);

// Updating routes
userRouter
  .route("/email")
  .patch(authMiddleware, userController.changeEmail);
userRouter
  .route("/avatar")
  .patch(authMiddleware, userController.changeAvatar);
userRouter
  .route("/address")
  .patch(authMiddleware, userController.changeAddress);
userRouter
  .route("/password")
  .patch(authMiddleware, userController.changePassword);
userRouter
  .route("/userName")
  .patch(authMiddleware, userController.changeUserName);
userRouter
  .route("/phoneNumber")
  .patch(authMiddleware, userController.changePhoneNumber);

// Deleting routes
userRouter
  .route("/:avatar")
  .delete(authMiddleware, userController.deleteAvatar);
userRouter
  .route("/:address")
  .delete(authMiddleware, userController.deleteAddress);
userRouter
  .route("/:email")
  .delete(authMiddleware, userController.deleteEmail);
