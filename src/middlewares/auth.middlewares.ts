import type { IUser } from "@/types/user.types";
import type { NextFunction } from "express";
import type { IRequest } from "@/types/request.type";

import jwt from "jsonwebtoken";
import { config } from "@/config";
import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";

const { jwtSecret } = config.jwtToken;

// muddleware to protect routes
export const authMiddleware = asyncHandler(
  async (request: IRequest, _, next: NextFunction) => {
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

      const user = await User.findById(decoded?._id).select("-password");

      if (!user) {
        return next(new ApiError(401, "User not found"));
      }

      request.user = user as IUser;
      next();
    } catch (error: any) {
      return next(new ApiError(401, error.message));
    }
  }
);
