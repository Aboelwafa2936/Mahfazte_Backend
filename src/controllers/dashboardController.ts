import { Response } from "express";
import { Transaction } from "../models/Transaction";
import { Goal } from "../models/Goal";
import { AuthRequest } from "../types/AuthRequest";

// API لجلب ملخص الـ Dashboard
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user.id;

    // 1️⃣ إجمالي المصروفات
    const totalExpenses = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 2️⃣ إجمالي الإيرادات
    const totalIncome = await Transaction.aggregate([
      { $match: { user: userId, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 3️⃣ إجمالي الديون
    const totalDebts = await Transaction.aggregate([
      { $match: { user: userId, type: "debt" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 4️⃣ نسبة التقدم في الأهداف
    const goals = await Goal.find({ user: userId });
    const goalsProgress = goals.map(goal => ({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      progress: Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    }));

    res.json({
      totalExpenses: totalExpenses[0]?.total || 0,
      totalIncome: totalIncome[0]?.total || 0,
      totalDebts: totalDebts[0]?.total || 0,
      goalsProgress
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};


