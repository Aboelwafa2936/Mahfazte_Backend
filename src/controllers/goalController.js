"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoal = exports.updateGoal = exports.getGoals = exports.addGoal = void 0;
const Goal_1 = require("../models/Goal");
// إضافة هدف جديد
const addGoal = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const { title, targetAmount, deadline } = req.body;
        if (!title || !targetAmount || !deadline) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const goal = await Goal_1.Goal.create({
            user: req.user._id,
            title,
            targetAmount,
            currentAmount: 0,
            deadline,
        });
        res.status(201).json(goal);
    }
    catch (error) {
        console.error("Error adding goal:", error);
        res.status(500).json({ message: "Error adding goal" });
    }
};
exports.addGoal = addGoal;
// جلب أهداف المستخدم
const getGoals = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const goals = await Goal_1.Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(goals);
    }
    catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).json({ message: "Error fetching goals" });
    }
};
exports.getGoals = getGoals;
// تعديل هدف
const updateGoal = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const goal = await Goal_1.Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: "Goal not found" });
        }
        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const { title, targetAmount, currentAmount, deadline } = req.body;
        if (title !== undefined)
            goal.title = title;
        if (targetAmount !== undefined)
            goal.targetAmount = targetAmount;
        if (currentAmount !== undefined)
            goal.currentAmount = currentAmount;
        if (deadline !== undefined)
            goal.deadline = deadline;
        const updatedGoal = await goal.save();
        res.json(updatedGoal);
    }
    catch (error) {
        console.error("Error updating goal:", error);
        res.status(500).json({ message: "Error updating goal" });
    }
};
exports.updateGoal = updateGoal;
// حذف هدف
const deleteGoal = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const goal = await Goal_1.Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: "Goal not found" });
        }
        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await goal.deleteOne();
        res.json({ message: "Goal removed" });
    }
    catch (error) {
        console.error("Error deleting goal:", error);
        res.status(500).json({ message: "Error deleting goal" });
    }
};
exports.deleteGoal = deleteGoal;
//# sourceMappingURL=goalController.js.map