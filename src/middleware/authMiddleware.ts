import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/AuthRequest";

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.user = decoded.id; // ✅ خليها كده
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

