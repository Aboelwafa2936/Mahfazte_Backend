"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statisticsController_1 = require("../controllers/statisticsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// ✅ ميدل وير للفاليديشن
const validateStatisticsQuery = [
    (0, express_validator_1.query)("start")
        .isISO8601()
        .withMessage("Start date must be a valid date in ISO8601 format"),
    (0, express_validator_1.query)("end")
        .isISO8601()
        .withMessage("End date must be a valid date in ISO8601 format"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
];
// 🛠 المسار النهائي
router.get("/", authMiddleware_1.protect, validateStatisticsQuery, (req, res) => {
    (0, statisticsController_1.getStatistics)(req, res);
});
exports.default = router;
//# sourceMappingURL=statisticsRoutes.js.map