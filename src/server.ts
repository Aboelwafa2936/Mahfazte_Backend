import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import goalRoutes from "./routes/goalRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();
connectDB();

const app = express();

// 📌 أمان
app.use(helmet()); // حماية من XSS و بعض الثغرات
app.use(cors()); // تفعيل CORS
app.use(express.json({ limit: "10kb" })); // تحديد حجم البيانات
app.use(errorHandler);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/statistics", statisticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
