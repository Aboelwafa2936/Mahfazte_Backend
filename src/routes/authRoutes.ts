import express, { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, deleteUser, logoutUser, getCurrentUser } from "../controllers/authController";
import { body, validationResult } from "express-validator";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

const validateRegister = [
  body("name").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  handleValidationErrors
];

const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors
];

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/logout", logoutUser);
router.delete("/:id", protect, deleteUser);
router.get("/me", protect, getCurrentUser);

export default router;

