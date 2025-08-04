"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error("❌ Error:", err.message || err);
    res.status(err.statusCode || 500).json({
        message: err.message || "Something went wrong",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorMiddleware.js.map