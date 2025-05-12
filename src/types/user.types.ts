import type { Document, Date } from "mongoose";

// Interface for base user
interface IBaseUser extends Document {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Interface for user authentication
interface IUserAuth extends Document {
  email: string[];
  phone?: number[];
  password: string;
  lastLogin: Date;
  accessToken?: string;
  refreshToken?: string;
  securityQuestion?: [
    {
      question: string;
      answer: string;
    },
  ];
}

interface IUserMethodes {
  comparePassword(candidatePassword: string): boolean;
  generateJWT(): string;
  generateRefreshToken(): string;
}

export type { IBaseUser, IUserAuth, IUserMethodes };
