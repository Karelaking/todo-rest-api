import type { Request } from "express";
import type { IUser } from "./user.types.ts";

export interface IRequest extends Request {
  user?: IUser;
}
