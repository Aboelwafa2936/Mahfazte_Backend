"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const dashboardController_1 = require("../controllers/dashboardController");
const express_validator_1 = require("express-validator");
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
 * 📌 فاليديشن لباراميترات التواريخ (اختيارية)
 * لو التواريخ اتبعتت لازم تكون ISO8601
 */
const validateDashboardQuery = [
    (0, express_validator_1.query)("startDate")
        .optional()
        .isISO8601()
        .withMessage("startDate must be a valid ISO8601 date"),
    (0, express_validator_1.query)("endDate")
        .optional()
        .isISO8601()
        .withMessage("endDate must be a valid ISO8601 date"),
    handleValidationErrors
];
const router = express_1.default.Router();
/**
 * 🛠 مسار الداشبورد
 */
router.get("/", authMiddleware_1.protect, validateDashboardQuery, (req, res) => {
    (0, dashboardController_1.getDashboardStats)(req, res);
});
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map