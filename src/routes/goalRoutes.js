"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const goalController_1 = require("../controllers/goalController");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
/**
 * ✅ Middleware للتحقق من الأخطاء بعد الفاليديشن
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
 * 📌 فاليديشن لإضافة هدف جديد
 */
const validateAddGoal = [
    (0, express_validator_1.body)("title")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters"),
    (0, express_validator_1.body)("targetAmount")
        .isNumeric()
        .withMessage("Target amount must be a number"),
    (0, express_validator_1.body)("deadline")
        .isISO8601()
        .withMessage("Deadline must be a valid date in ISO8601 format"),
    handleValidationErrors
];
/**
 * 📌 فاليديشن لتعديل هدف
 */
const validateUpdateGoal = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid goal ID"),
    (0, express_validator_1.body)("title").optional().isString().isLength({ min: 3 }),
    (0, express_validator_1.body)("targetAmount").optional().isNumeric(),
    (0, express_validator_1.body)("currentAmount").optional().isNumeric(),
    (0, express_validator_1.body)("deadline").optional().isISO8601(),
    handleValidationErrors
];
/**
 * 📌 فاليديشن لحذف هدف
 */
const validateDeleteGoal = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid goal ID"),
    handleValidationErrors
];
/**
 * 🛠 المسارات
 */
router.route("/")
    .post(authMiddleware_1.protect, validateAddGoal, (req, res) => {
    (0, goalController_1.addGoal)(req, res);
})
    .get(authMiddleware_1.protect, (req, res) => {
    (0, goalController_1.getGoals)(req, res);
});
router.route("/:id")
    .put(authMiddleware_1.protect, validateUpdateGoal, (req, res) => {
    (0, goalController_1.updateGoal)(req, res);
})
    .delete(authMiddleware_1.protect, validateDeleteGoal, (req, res) => {
    (0, goalController_1.deleteGoal)(req, res);
});
exports.default = router;
//# sourceMappingURL=goalRoutes.js.map