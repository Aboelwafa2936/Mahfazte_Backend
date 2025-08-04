import express, { Request, Response, NextFunction } from "express";
import { getStatistics } from "../controllers/statisticsController";
import { protect } from "../middleware/authMiddleware";
import { query, validationResult } from "express-validator";
import { AuthRequest } from "../types/AuthRequest";

const router = express.Router();

// ✅ ميدل وير للفاليديشن
const validateStatisticsQuery = [
  query("start")
    .isISO8601()
    .withMessage("Start date must be a valid date in ISO8601 format"),
  query("end")
    .isISO8601()
    .withMessage("End date must be a valid date in ISO8601 format"),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

// 🛠 المسار النهائي
router.get(
  "/",
  protect,
  validateStatisticsQuery,
  (req: AuthRequest, res: Response) => {
    getStatistics(req, res);
  }
);

export default router;
