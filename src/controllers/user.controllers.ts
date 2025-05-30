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

      const newEmail = request.body.email as string;

      if (!newEmail) {
        return next(new ApiError(400, "Email is required"));
      }

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
    async (request: IRequest, response: Response, next: NextFunction) => {
      const newAvatar = "" as string;
      const userId = request?.user?._id;

      if (!newAvatar) {
        return next(new ApiError(400, "Avatar is required"));
      }

      if (!userId) {
        return next(new ApiError(401, "User not logged in"));
      }

      try {
        const user = await User.findById(userId);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (user.profileImage) {
          return next(new ApiError(400, "Avatar already exists"));
        }

        user.profileImage = newAvatar;
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Avatar added successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );

  addAddress = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      const newAddress = request.body.address as string;

      if (!newAddress) {
        return next(new ApiError(400, "Address is required"));
      }

      try {
        const user = await User.findById(request?.user?._id);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (user.address.some((address) => address === newAddress)) {
          return next(new ApiError(400, "Address already exists"));
        }
        user.address.push(newAddress);
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Address added successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );

  addPhoneNumber = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      const newPhoneNumber = request.body.phone as number;

      if (!newPhoneNumber) {
        return next(new ApiError(400, "Phone number is required"));
      }

      try {
        const user = await User.findById(request?.user?._id);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (user.phone.some((phone) => phone === newPhoneNumber)) {
          return next(new ApiError(400, "Phone number already exists"));
        }
        user.phone.push(newPhoneNumber);
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Phone number added successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );

  changeEmail = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      const newEmail = request.body.email as string;
      const index = Number(request.query.index) || (1 as number);
      const userId = request?.user?._id;

      if (!userId) {
        return next(new ApiError(401, "User not logged in"));
      }

      if (!newEmail) {
        return next(new ApiError(400, "Email is required"));
      }

      if (String(!index)) {
        return next(new ApiError(400, "Index is required"));
      }

      try {
        const user = await User.findById(userId);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (user.email.some((email) => email === newEmail)) {
          return next(new ApiError(400, "Email already exists"));
        }

        if (user.email[index] === newEmail) {
          return next(new ApiError(400, "Email already exists"));
        }

        if (user.email.length <= index) {
          return next(new ApiError(400, "Index out of range"));
        }

        user.email[index] = newEmail;
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Email changed successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );
  changeAvatar = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      const newAvatar = "" as string;
      const userId = request?.user?._id;

      if (!userId) {
        return next(new ApiError(401, "User not logged in"));
      }

      if (!newAvatar) {
        return next(new ApiError(400, "Avatar is required"));
      }

      try {
        const user = await User.findById(userId);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        user.profileImage = newAvatar;
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Avatar changed successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );

  changeAddress = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      const newAddress = request.body.address as string;
      const index = Number(request.query.index) || (1 as number);
      const userId = request?.user?._id;

      if (!userId) {
        return next(new ApiError(401, "User not logged in"));
      }

      if (!newAddress) {
        return next(new ApiError(400, "Address is required"));
      }

      if (String(!index)) {
        return next(new ApiError(400, "Index is required"));
      }

      try {
        const user = await User.findById(userId);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (user.address.some((address) => address === newAddress)) {
          return next(new ApiError(400, "Address already exists"));
        }

        if (user.address[index] === newAddress) {
          return next(new ApiError(400, "Address already exists"));
        }

        if (user.address.length <= index) {
          return next(new ApiError(400, "Index out of range"));
        }

        user.address[index] = newAddress;
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Address changed successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );
  changePassword = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      const oldPassword = request.body.oldPassword as string;
      const newPassword = request.body.newPassword as string;
      const confirmPassword = request.body.confirmPassword as string;

      if (newPassword !== confirmPassword) {
        return next(
          new ApiError(400, "Password and confirm password do not match")
        );
      }

      const userId = request?.user?._id;

      if (!userId) {
        return next(new ApiError(401, "User not logged in"));
      }

      if (!newPassword) {
        return next(new ApiError(400, "Password is required"));
      }

      try {
        const user = await User.findById(userId);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (!user.comparePassword(oldPassword)) {
          return next(new ApiError(400, "Password is incorrect"));
        }

        if (user.comparePassword(newPassword)) {
          return next(new ApiError(400, "Password already exists"));
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Password changed successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );
  changeUserName = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      const newUserName = request.body.userName as string;
      const userId = request?.user?._id;

      if (!userId) {
        return next(new ApiError(401, "User not logged in"));
      }

      if (!newUserName) {
        return next(new ApiError(400, "User name is required"));
      }

      try {
        const user = await User.findById(userId);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (user.userName === newUserName) {
          return next(new ApiError(400, "User name already exists"));
        }

        user.userName = newUserName;
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "User name changed successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );
  changePhoneNumber = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      const newPhoneNumber = request.body.phoneNumber as number;
      const userId = request?.user?._id;
      const index = Number(request.query.index);
      console.log(index);


      if (!userId) {
        return next(new ApiError(401, "User not logged in"));
      }

      if (!String(index)) {
        return next(new ApiError(400, "Index is required"));
      }

      if (!newPhoneNumber) {
        return next(new ApiError(400, "Phone number is required"));
      }

      try {
        const user = await User.findById(userId);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (user.phone.some((phone) => phone === newPhoneNumber)) {
          return next(new ApiError(400, "Phone number already exists"));
        }

        if (user.phone[index] === newPhoneNumber) {
          return next(new ApiError(400, "Phone number already exists"));
        }

        if (user.phone.length<= index) {
          return next(new ApiError(400, "Index out of range"));
        }
        user.phone[index] = newPhoneNumber;
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Phone number changed successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );
  deleteAvatar = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      try {
        const user = await User.findById(request?.user?._id);
        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (!user.profileImage) {
          return next(new ApiError(400, "Avatar not found"));
        }

        user.profileImage = "";
        await user.save({ validateBeforeSave: false });
        response.status(200).json({
          message: "Avatar deleted successfully",
        });
      } catch (error: any) {
        next(error);
      }
    }
  );

  deleteAddress = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      const userId = request?.user?._id;
      const index = Number(request.query.index);

      if (!userId) {
        return next(new ApiError(401, "User not logged in"));
      }

      if (!String(index)) {
        return next(new ApiError(400, "Index is required"));
      }

      try {
        const user = await User.findById(userId);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (user.address.length<= index) {
          return next(new ApiError(400, "Index out of range"));
        }

        user.address.splice(index, 1);
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Address deleted successfully",
        });
      }
      catch (error: any) {
        next(error);
      }
    }
  );
  deleteEmail = asyncHandler(
    async (request: IRequest, response: Response, next: NextFunction) => {
      const userId = request?.user?._id;
      const index = Number(request.query.index);

      if (!userId) {
        return next(new ApiError(401, "User not logged in"));
      }

      if (!String(index)) {
        return next(new ApiError(400, "Index is required"));
      }

      try {
        const user = await User.findById(userId);

        if (!user) {
          return next(new ApiError(401, "User not found"));
        }

        if (user.email.length<= index) {
          return next(new ApiError(400, "Index out of range"));
        }

        user.email.splice(index, 1);
        await user.save({ validateBeforeSave: false });

        response.status(200).json({
          message: "Email deleted successfully",
        });
      }
      catch (error: any) {
        next(error);
      }
    }
  );
}
