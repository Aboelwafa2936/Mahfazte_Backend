import { Goal } from "../models/Goal";
import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { getIO } from "../socket";
import { notifyUser } from "../utils/notifyUser";

// إضافة هدف جديد
export const addGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, targetAmount, currentAmount = 0, deadline } = req.body;

    if (!title || !targetAmount || !deadline) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const goal = await Goal.create({
      user: req.user.id,
      title,
      targetAmount,
      currentAmount,
      deadline,
    });

    notifyUser(req.user.id, {
      id: goal._id.toString(),
      type: "goal",
      action: "added",
      data: goal,
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error("Error adding goal:", error);
    res.status(500).json({ message: "Error adding goal" });
  }
};

// تعديل هدف
export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, targetAmount, currentAmount, deadline } = req.body;

    if (title !== undefined) goal.title = title;
    if (targetAmount !== undefined) goal.targetAmount = targetAmount;
    if (currentAmount !== undefined) goal.currentAmount = currentAmount;
    if (deadline !== undefined) goal.deadline = deadline;

    const updatedGoal = await goal.save();

    notifyUser(req.user.id, {
      id: goal._id.toString(),
      type: "goal",
      action: "updated",
      data: goal,
    });

    res.json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Error updating goal" });
  }
};

// حذف هدف
export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const deletedTitle = goal.title;
    await goal.deleteOne();
    notifyUser(req.user.id, {
      id: goal._id.toString(),
      type: "goal",
      action: "deleted",
      data: goal,
    });

    res.json({ message: "Goal removed" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: "Error deleting goal" });
  }
};

// جلب أهداف المستخدم
export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const goals = await Goal.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    // ضمان وجود currentAmount
    const goalsWithDefault = goals.map((goal) => ({
      ...goal.toObject(),
      currentAmount: goal.currentAmount ?? 0,
    }));

    res.json(goalsWithDefault);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: "Error fetching goals" });
  }
};
