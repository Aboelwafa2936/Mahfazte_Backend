import mongoose, { Document, ObjectId } from "mongoose";
import { IUser } from "./User";

export interface IGoal extends Document {
  _id: ObjectId;
  user: ObjectId | IUser;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
}

const goalSchema = new mongoose.Schema<IGoal>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true }
  },
  { timestamps: true }
);

export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
