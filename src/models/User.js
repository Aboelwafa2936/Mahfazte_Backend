"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
// تشفير الباسورد قبل الحفظ
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcrypt_1.default.genSalt(10);
    this.password = await bcrypt_1.default.hash(this.password, salt);
    next();
});
// مقارنة الباسورد
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt_1.default.compare(enteredPassword, this.password);
};
exports.User = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map