import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  type: "income" | "expense" | "debt";
  amount: number;
  date: Date;
  title?: string;
  source?: string;
  lender?: string;
  category?: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense", "debt"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    title: String,
    source: String,
    lender: String,
    category: String
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);

