import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import type { IUser } from "@/models/user.model";
import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";

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

  logout = asyncHandler(async (request: Request, response: Response) => {
    response.send("User logged out");
  });

  delete = asyncHandler(async (request: Request, response: Response) => {
    response.send("User deleted");
  });
}
