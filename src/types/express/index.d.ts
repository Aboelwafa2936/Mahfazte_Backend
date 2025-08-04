import { IUser } from "../models/User";
import { Document, ObjectId } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: IUser & Document & { _id: ObjectId };
    }
  }
}

export {};
