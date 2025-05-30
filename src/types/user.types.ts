import type { Document, Date } from "mongoose";


// Interface for base user
interface IBaseUser extends Document {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage?: string;
}

// Interface for user authentication
interface IUserAuth extends Document {
  email: string[];
  phone: number[];
  password: string;
  lastLogin: Date | null;
  loginCount: number;
  loginDevicesIP?:number;
  accessToken?: string;
  refreshToken?: string;
  securityQuestion?: [
    {
      question: string;
      answer: string;
    },
  ];
  failedLoginAttempts: number;
  accountLocked: boolean;
  lockUntil: any;
  passwordHistory: string[];
  lastPasswordChange:any;
  // Token for password reset
  resetPasswordToken: String;
  resetPasswordExpires: Date;

  // Two-factor authentication
  twoFactorEnabled: {
    type: Boolean;
    default: false;
  };
  twoFactorSecret: String;
}

interface IUserMethodes {
  generateJWT(): string;
  generateRefreshToken(): string;
  lastPasswordChange():any;
  resetFailedAttempts(): void;
  encryptPassword(password: string): string;
  comparePassword(candidatePassword: string): boolean;
  isPasswordReused(password: string): Promise<boolean>;
  incrementFailedAttempts(): Promise<void>;
}

export  type IUser = IBaseUser & IUserAuth & IUserMethodes;
