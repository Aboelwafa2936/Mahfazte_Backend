"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
/**
 * ✅ Middleware لمعالجة أخطاء الفاليديشن
 */
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    handleValidationErrors
];
/**
 * 📌 فاليديشن لتسجيل الدخول
 */
const validateLogin = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required"),
    handleValidationErrors
];
/**
 * 🛠 مسارات التوثيق
 */
router.post("/register", validateRegister, authController_1.registerUser);
router.post("/login", validateLogin, authController_1.loginUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map