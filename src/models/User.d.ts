import mongoose, { Document, ObjectId } from "mongoose";
export interface IUser extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    comparePassword(enteredPassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map