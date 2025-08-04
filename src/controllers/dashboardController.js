"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Transaction_1 = require("../models/Transaction");
const Goal_1 = require("../models/Goal");
// API لجلب ملخص الـ Dashboard
const getDashboardStats = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Not authorized" });
        const userId = req.user._id;
        // 1️⃣ إجمالي المصروفات
        const totalExpenses = await Transaction_1.Transaction.aggregate([
            { $match: { user: userId, type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        // 2️⃣ إجمالي الإيرادات
        const totalIncome = await Transaction_1.Transaction.aggregate([
            { $match: { user: userId, type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        // 3️⃣ نسبة التقدم في الأهداف
        const goals = await Goal_1.Goal.find({ user: userId });
        const goalsProgress = goals.map(goal => ({
            title: goal.title,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            progress: Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) // نسبة %
        }));
        res.json({
            totalExpenses: totalExpenses[0]?.total || 0,
            totalIncome: totalIncome[0]?.total || 0,
            goalsProgress
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats" });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboardController.js.map