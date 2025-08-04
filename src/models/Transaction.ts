import mongoose from "mongoose";

export interface ITransaction extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: Date;
  description?: string;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
