import express, { Request, Response, NextFunction } from "express";
import { protect } from "../middleware/authMiddleware";
import { getTransactionsWithFilters } from "../controllers/transactionController";
import { query, validationResult } from "express-validator";

const router = express.Router();

interface FilterQuery {
  page?: string;
  limit?: string;
  type?: "income" | "expense";
  startDate?: string;
  endDate?: string;
}

// GET /api/transactions/filters?page=1&limit=10&type=expense&startDate=2025-08-01&endDate=2025-08-04
router.get(
  "/filters",
  protect,
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
    query("type")
      .optional()
      .isIn(["income", "expense"])
      .withMessage('Type must be either "income" or "expense"'),
    query("startDate")
      .optional()
      .isISO8601()
      .withMessage("startDate must be a valid date (YYYY-MM-DD)"),
    query("endDate")
      .optional()
      .isISO8601()
      .withMessage("endDate must be a valid date (YYYY-MM-DD)"),
  ],
  (req: Request<{}, {}, {}, FilterQuery>, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  getTransactionsWithFilters
);

export default router;
