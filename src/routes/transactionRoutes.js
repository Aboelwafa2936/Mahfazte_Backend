"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const transactionController_1 = require("../controllers/transactionController");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// GET /api/transactions/filters?page=1&limit=10&type=expense&startDate=2025-08-01&endDate=2025-08-04
router.get("/filters", authMiddleware_1.protect, [
    (0, express_validator_1.query)("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    (0, express_validator_1.query)("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
    (0, express_validator_1.query)("type")
        .optional()
        .isIn(["income", "expense"])
        .withMessage('Type must be either "income" or "expense"'),
    (0, express_validator_1.query)("startDate")
        .optional()
        .isISO8601()
        .withMessage("startDate must be a valid date (YYYY-MM-DD)"),
    (0, express_validator_1.query)("endDate")
        .optional()
        .isISO8601()
        .withMessage("endDate must be a valid date (YYYY-MM-DD)"),
], (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, transactionController_1.getTransactionsWithFilters);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map