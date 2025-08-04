import express, { Request, Response, NextFunction } from "express";
import { protect } from "../middleware/authMiddleware";
import { getDashboardStats } from "../controllers/dashboardController";
import { query, validationResult } from "express-validator";
import { AuthRequest } from "../types/AuthRequest";


/**
 * ✅ Middleware لمعالجة أخطاء الفاليديشن
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

/**
 * 📌 فاليديشن لباراميترات التواريخ (اختيارية)
 * لو التواريخ اتبعتت لازم تكون ISO8601
 */
const validateDashboardQuery = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid ISO8601 date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid ISO8601 date"),
  handleValidationErrors
];

const router = express.Router();

/**
 * 🛠 مسار الداشبورد
 */
router.get(
  "/",
  protect,
  validateDashboardQuery,
  (req: AuthRequest, res: Response) => {
    getDashboardStats(req, res);
  }
);

export default router;


