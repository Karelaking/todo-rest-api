import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

import type { IRequest } from "@/types/request.type";
import type { NextFunction, Request, Response } from "express";

export class UserController {
  // Methode for getting user
  addEmail = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      console.log(request.body);

      const newEmail = request.body.email;

      try {
        const user = await User.findById(request?.user?._id);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (user.email.some((email) => email === newEmail)) {
          return next(new ApiError(400, "Email already exists"));
        }
        user.email.push(newEmail);
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Email added successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );

  addAvatar = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Avatar added successfully",
      });
    }
  );

  addAddress = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Address added successfully",
      });
    }
  );

  addPhoneNumber = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Phone number added successfully",
      });
    }
  );
  changeEmail = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Email changed successfully",
      });
    }
  );
  changeAvatar = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Avatar changed successfully",
      });
    }
  );
  changeAddress = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Address changed successfully",
      });
    }
  );
  changePassword = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Password changed successfully",
      });
    }
  );
  changeUserName = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "User name changed successfully",
      });
    }
  );
  changePhoneNumber = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Phone number changed successfully",
      });
    }
  );
  deleteAvatar = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Avatar deleted successfully",
      });
    }
  );
  deleteAddress = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Address deleted successfully",
      });
    }
  );
  deleteEmail = asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      response.status(200).json({
        message: "Email deleted successfully",
      });
    }
  );
}
