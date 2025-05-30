import type { Request } from "express";
import type { IUser } from "./user.types";

export interface IRequest extends Request {
  user?: IUser;
}
