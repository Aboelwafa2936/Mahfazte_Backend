import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import http from "http"; // 📌 جديد
import { Server } from "socket.io"; // 📌 جديد
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import goalRoutes from "./routes/goalRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import { initSocket } from "./socket"; // 📌 جديد

dotenv.config();
connectDB();

const app = express();

// 📌 أمان
app.use(helmet());

// 📌 CORS مع إعدادات الكوكيز
app.use(
  cors({
    origin: "http://localhost:5173", // رابط الفرونت
    credentials: true,
  })
);

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

// ==========================
// 📌 Socket.IO إعداد
// ==========================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// 📌 تهيئة الـ Socket.IO
initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);


