import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import { Schema, model, Types } from "mongoose";
import type { IBaseUser, IUserAuth, IUserMethodes } from "@/types/user.types";

export type IUser = IBaseUser & IUserAuth & IUserMethodes;

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    userName: {
      unique: true,
      type: String,
      required: [true, "User name is required"],
      match: [/^[a-zA-Z0-9]+$/, "User name must be alphanumeric"],
    },
    firstName: {
      type: String,
      minlength: 5,
      maxlength: 50,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      minlength: 5,
      maxlength: 50,
      required: [true, "Last name is required"],
    },
    email: [
      {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Email is invalid"],
      },
    ],
    phone: [
      {
        length: 10,
        type: Number,
        Math: [/^\S+@\S+\.\S+$/, "Phone number is invalid"],
      },
    ],
    password: {
      type: String,
      minlength: 4,
      maxlength: 20,
      required: [true, "Password is required"],
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,20}$/,
        "Password is weak",
      ],
    },
    lastLogin: { type: Date, default: "" },
    accessToken: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
    securityQuestion: [
      {
        question: {
          type: String,
        },
        answer: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.index({ email: 1, userName: 1 }, { unique: true });

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.set("password", hash);
    next();
  });
});

userSchema.methods.comparePassword = function (
  candidatePassword: string
): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
};

userSchema.methods.generateJWT = function (): string {
  const token = jwt.sign({ _id: this._id }, config.jwtSecret, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.generateRefreshToken = function (): string {
  const token = jwt.sign({ _id: this._id }, config.jwtRefreshSecret, {
    expiresIn: "7d",
  });
  return token;
};

export const User = model("User", userSchema);
