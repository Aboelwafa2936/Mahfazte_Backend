import express, { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { body, validationResult } from "express-validator";

const router = express.Router();

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
 * 📌 فاليديشن لتسجيل مستخدم جديد
 */
const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  handleValidationErrors
];

/**
 * 📌 فاليديشن لتسجيل الدخول
 */
const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  handleValidationErrors
];

/**
 * 🛠 مسارات التوثيق
 */
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

export default router;

