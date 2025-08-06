import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AuthRequest } from "../types/AuthRequest";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
};

// 📌 إعدادات الكوكي統一ة
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS في الإنتاج
  sameSite: "none" as const, // لازم تكون none علشان cross-site
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 يوم
};

// تسجيل حساب جديد
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user.id);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "Registration successful",
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// تسجيل الدخول
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);

    res.cookie("token", token, cookieOptions);

    res.json({
      message: "Login successful",
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// تسجيل الخروج
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none"
  });
  res.json({ message: "Logged out successfully" });
};

// حذف مستخدم
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// إحضار المستخدم الحالي
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch {
    res.status(500).json({ message: "Error fetching user data" });
  }
};
