

import jwt from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import type { IRequest } from "../types/request.type.ts";
import { config } from "../config.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import type { IUser } from "../types/user.types.ts";
import { User } from "../models/user.model.ts";

const { jwtSecret } = config.jwtToken;

// muddleware to protect routes
export const authMiddleware = asyncHandler(
  async (request: IRequest, _:Response, next: NextFunction) => {
    try {
      const token =
        request.headers.authorization?.replace("Bearer ", "") ||
        request.cookies?.accessToken;

      if (!token) {
        return next(new ApiError(401, "Token not found"));
      }
      const decoded = jwt.verify(token, jwtSecret) as IUser;

      if (!decoded) {
        return next(new ApiError(401, "Unable to decode token"));
      }

      const user: IUser | null = await User.findById(decoded?._id).select("-password");

      if (!user) {
        return next(new ApiError(401, "User not found"));
      }

      request.user = user;
      next();
    } catch (error: any) {
      return next(new ApiError(401, error.message));
    }
  }
);
