import mongoose from "mongoose";
export interface ITransaction extends mongoose.Document {
    user: mongoose.Schema.Types.ObjectId;
    type: "income" | "expense";
    category: string;
    amount: number;
    date: Date;
    description?: string;
}
export declare const Transaction: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}, {}> & ITransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Transaction.d.ts.map