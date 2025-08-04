"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    }
    catch (err) {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map