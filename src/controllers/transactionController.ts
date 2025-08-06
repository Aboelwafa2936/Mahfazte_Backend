import { Response } from "express";
import { Transaction } from "../models/Transaction";
import { AuthRequest } from "../types/AuthRequest";

export const getTransactionsWithFilters = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Not authorized" });

    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { user: userId };

    // ✅ السماح بالـ debt بجانب income و expense
    if (req.query.type) {
      const type = req.query.type.toString().toLowerCase();
      if (!["income", "expense", "debt"].includes(type)) {
        return res.status(400).json({ message: "Invalid transaction type" });
      }
      filter.type = type;
    }

    if (req.query.startDate && req.query.endDate) {
      const start = new Date(req.query.startDate as string);
      const end = new Date(req.query.endDate as string);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      filter.date = { $gte: start, $lte: end };
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      transactions
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

// 📌 جلب كل المعاملات
export const getAllTransactions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Not authorized" });

    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

// 📌 إضافة معاملة جديدة
export const addTransaction = async (req: AuthRequest, res: Response) => {
  console.log("Incoming transaction:", req.body);
  console.log("User from token:", req.user);

  try {
    if (!req.user?.id) return res.status(401).json({ message: "Not authorized" });

    const { type, amount, date, title, source, lender, category } = req.body;

    if (!type || !amount || !date) {
      return res.status(400).json({ message: "Type, amount, and date are required" });
    }

    const transaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      date: new Date(date),
      title,
      source,
      lender,
      category
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Error adding transaction" });
  }
};

// 📌 تعديل معاملة
export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Not authorized" });

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction" });
  }
};

// 📌 حذف معاملة
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Not authorized" });

    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction" });
  }
};


