"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsWithFilters = void 0;
const Transaction_1 = require("../models/Transaction");
// جلب المعاملات مع Pagination + Filters
const getTransactionsWithFilters = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Not authorized" });
        const userId = req.user._id;
        // Pagination parameters
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Filters
        const filter = { user: userId };
        // تصفية بالنوع (income / expense)
        if (req.query.type) {
            filter.type = req.query.type;
        }
        // تصفية بالتاريخ (من وإلى)
        if (req.query.startDate && req.query.endDate) {
            filter.date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }
        // جلب البيانات
        const transactions = await Transaction_1.Transaction.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        // إجمالي عدد النتائج (للصفحات)
        const total = await Transaction_1.Transaction.countDocuments(filter);
        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            transactions
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching transactions" });
    }
};
exports.getTransactionsWithFilters = getTransactionsWithFilters;
//# sourceMappingURL=transactionController.js.map