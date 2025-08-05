import { Response } from "express";
import { Transaction } from "../models/Transaction";
import { AuthRequest } from "../types/AuthRequest";

export const getTransactionsWithFilters = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const userId = req.user;
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


