import cookieParser  from 'cookie-parser';
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
app.use(helmet());

// 📌 CORS مع إعدادات الكوكيز
app.use(cors({
  origin: "http://localhost:5173", // رابط الفرونت
  credentials: true
}));

// 📌 قراءة JSON من الطلبات
app.use(express.json({ limit: "10kb" }));

// 📌 قراءة الكوكيز
app.use(cookieParser());

// 📌 Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/statistics", statisticsRoutes);

// 📌 Error Handler في الآخر
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

