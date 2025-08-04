import { Goal } from "../models/Goal";
import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";

// إضافة هدف جديد
export const addGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, targetAmount, deadline } = req.body;

    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title,
      targetAmount,
      currentAmount: 0,
      deadline,
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error("Error adding goal:", error);
    res.status(500).json({ message: "Error adding goal" });
  }
};

// جلب أهداف المستخدم
export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: "Error fetching goals" });
  }
};

// تعديل هدف
export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, targetAmount, currentAmount, deadline } = req.body;

    if (title !== undefined) goal.title = title;
    if (targetAmount !== undefined) goal.targetAmount = targetAmount;
    if (currentAmount !== undefined) goal.currentAmount = currentAmount;
    if (deadline !== undefined) goal.deadline = deadline;

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Error updating goal" });
  }
};

// حذف هدف
export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await goal.deleteOne();
    res.json({ message: "Goal removed" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: "Error deleting goal" });
  }
};


