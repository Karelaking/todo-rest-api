import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import type { IUser } from "@/types/user.types";
import { Schema, model } from "mongoose";

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
        Math: [/^\S+@\S+\.\S+$/, "Phone number is invalid"], // 'Math' should be 'match'
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password is weak",
      ],
    },
    profileImage: { type: String, default: "" },
    loginCount: { type: Number, default: 0 },
    loginDevicesIP: {
      type: [Number],
      default: [],
      match: [/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, "IP address is invalid"],
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
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLocked: {
      type: Boolean,
      default: false,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    passwordHistory: {
      type: [String],
      default: [],
      max: 5, // Keep last 5 password hashes
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },
    // Token for password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // Two-factor authentication
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
  },
  { timestamps: true }
);

userSchema.index({ email: 1, userName: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = function (
  candidatePassword: string
): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
};

userSchema.methods.generateJWT = function (): string {
  const token = jwt.sign(
    { _id: this._id, userName: this.userName, email: this.email },
    config.jwtToken.jwtSecret,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

userSchema.methods.generateRefreshToken = function (): string {
  const token = jwt.sign(
    { _id: this._id, userName: this.userName, email: this.email },
    config.jwtToken.jwtRefreshSecret,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

userSchema.methods.isPasswordReused = async function (password: string) {
  for (const oldPassword of this.passwordHistory) {
    if (await bcrypt.compare(password, oldPassword)) {
      return true;
    }
  }
  return false;
};

export const User = model("User", userSchema);
