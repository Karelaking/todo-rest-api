import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import type { IUser } from "@/types/user.types";
import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import type { IRequest } from "@/types/request.type";

export class AuthController {
  // Methode for generating access and refresh accessToken
  generateAccessAndRefereshTokens = async (userId: string) => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      const accessToken = user?.generateJWT();
      const refreshToken = user?.generateRefreshToken();

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating referesh and access token"
      );
    }
  };

  // Methode for register user
  register = asyncHandler(async (request: Request, response: Response) => {
    const { userName, firstName, lastName, email, password } = request.body;
    console.log({
      "info form user": request.body,
    });

    if (
      [userName, firstName, lastName, email, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    console.log("existingUser", existingUser);

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const user: IUser = await User.create({
      email,
      lastName,
      userName,
      password,
      firstName,
    });

    console.log("user", user);

    if (!user) {
      throw new ApiError(500, "Something went wrong while creating user");
    }

    response.status(201).json({
      message: "User created successfully",
      status: 200,
      user: user,
    });
  });

  // Methode for login user
  login = asyncHandler(async (request: Request, response: Response) => {
    const { email, password, userName } = request.body;

    if ([email, password, userName].some((field) => field?.trim() == "")) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.comparePassword(password)) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (user.accessToken && user.refreshToken) {
      throw new ApiError(400, "User already logged in");
    }

    const { accessToken, refreshToken } =
      await this.generateAccessAndRefereshTokens(user._id as string); // Generate access and refresh tokens
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    response
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, user, "User logged in successfully"));
  });

  logout = asyncHandler(async (request: IRequest, response: Response) => {
    const userId = request.user?._id;
    if (!userId) {
      throw new ApiError(401, "User not logged in");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.accessToken = "";
    user.refreshToken = "";

    await user.save({ validateBeforeSave: false });

    response
      .status(200)
      .json(new ApiResponse(200, user, "User logged out successfully"));
  });

  delete = asyncHandler(async (request: IRequest, response: Response) => {
    const userId = request.user?._id;
    if (!userId) {
      throw new ApiError(401, "User not logged in");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await User.deleteOne({ _id: userId });

    response
      .status(200)
      .json(new ApiResponse(200, user, "User deleted successfully"));
  });

  refreshToken = asyncHandler(async (request: Request, response: Response) => {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      throw new ApiError(400, "Refresh token is required");
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      throw new ApiError(400, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateAccessAndRefereshTokens(user._id as string);

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    response
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, user, "Refresh token updated successfully"));
  });
}
