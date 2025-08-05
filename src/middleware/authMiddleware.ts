import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token; // قراءة التوكين من الكوكي

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    (req as any).user = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};