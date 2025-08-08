import express, { Request, Response, NextFunction } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  addGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController";
import { body, param, validationResult } from "express-validator";
import { AuthRequest } from "../types/AuthRequest";

const router = express.Router();

/**
 * ✅ Middleware للتحقق من الأخطاء بعد الفاليديشن
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
 * 📌 فاليديشن لإضافة هدف جديد
 */
const validateAddGoal = [
  body("title")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
    
  body("targetAmount")
    .isNumeric()
    .withMessage("Target amount must be a number")
    .custom((value) => value > 0)
    .withMessage("Target amount must be greater than zero"),
  
  body("currentAmount")
    .optional() // عشان لو المستخدم ما بعتهاش تشتغل
    .isNumeric()
    .withMessage("Current amount must be a number")
    .custom((value, { req }) => {
      if (value < 0) {
        throw new Error("Current amount cannot be negative");
      }
      if (value > req.body.targetAmount) {
        throw new Error("Current amount cannot exceed target amount");
      }
      return true;
    }),

  body("deadline")
    .isISO8601()
    .withMessage("Deadline must be a valid date in ISO8601 format")
    .custom((value) => {
      const selectedDate = new Date(value);
      if (selectedDate < new Date()) {
        throw new Error("Deadline must be in the future");
      }
      return true;
    }),

  handleValidationErrors
];


/**
 * 📌 فاليديشن لتعديل هدف
 */
const validateUpdateGoal = [
  param("id").isMongoId().withMessage("Invalid goal ID"),
  body("title").optional().isString().isLength({ min: 3 }),
  body("targetAmount").optional().isNumeric(),
  body("currentAmount").optional().isNumeric(),
  body("deadline").optional().isISO8601(),
  handleValidationErrors
];

/**
 * 📌 فاليديشن لحذف هدف
 */
const validateDeleteGoal = [
  param("id").isMongoId().withMessage("Invalid goal ID"),
  handleValidationErrors
];

/**
 * 🛠 المسارات
 */
router.route("/")
  .post(protect, validateAddGoal, (req: AuthRequest, res: Response) => {
    addGoal(req, res);
  })
  .get(protect, (req: AuthRequest, res: Response) => {
    getGoals(req, res);
  });

router.route("/:id")
  .put(protect, validateUpdateGoal, (req: AuthRequest, res: Response) => {
    updateGoal(req, res);
  })
  .delete(protect, validateDeleteGoal, (req: AuthRequest, res: Response) => {
    deleteGoal(req, res);
  });

export default router;

