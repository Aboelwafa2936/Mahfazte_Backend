"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatistics = void 0;
const Transaction_1 = require("../models/Transaction");
// 📊 إحصائيات بين تاريخين
const getStatistics = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Not authorized" });
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ message: "Please provide start and end dates" });
        }
        const startDate = new Date(start);
        const endDate = new Date(end);
        const stats = await Transaction_1.Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$type", // expense / income
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        const result = {
            income: stats.find(s => s._id === "income")?.totalAmount || 0,
            expense: stats.find(s => s._id === "expense")?.totalAmount || 0
        };
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching transaction stats" });
    }
};
exports.getStatistics = getStatistics;
//# sourceMappingURL=statisticsController.js.map