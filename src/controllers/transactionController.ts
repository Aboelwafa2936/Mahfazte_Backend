import { Response } from "express";
import { Transaction } from "../models/Transaction";
import { AuthRequest } from "../types/AuthRequest";

// جلب المعاملات مع Pagination + Filters
export const getTransactionsWithFilters = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const userId = req.user._id;

    // Pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const filter: any = { user: userId };

    // تصفية بالنوع (income / expense)
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // تصفية بالتاريخ (من وإلى)
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string)
      };
    }

    // جلب البيانات
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // إجمالي عدد النتائج (للصفحات)
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

