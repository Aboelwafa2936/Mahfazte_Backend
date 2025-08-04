"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const statisticsRoutes_1 = __importDefault(require("./routes/statisticsRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
// 📌 أمان
app.use((0, helmet_1.default)()); // حماية من XSS و بعض الثغرات
app.use((0, cors_1.default)()); // تفعيل CORS
app.use(express_1.default.json({ limit: "10kb" })); // تحديد حجم البيانات
app.use(errorMiddleware_1.errorHandler);
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/transactions", transactionRoutes_1.default);
app.use("/api/goals", goalRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api/statistics", statisticsRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map