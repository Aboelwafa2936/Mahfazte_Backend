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
export declare const Goal: mongoose.Model<IGoal, {}, {}, {}, mongoose.Document<unknown, {}, IGoal, {}, {}> & IGoal & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Goal.d.ts.map