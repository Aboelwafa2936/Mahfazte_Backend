"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
// تسجيل حساب جديد
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User_1.User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });
        const user = await User_1.User.create({ name, email, password });
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.registerUser = registerUser;
// تسجيل الدخول
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=authController.js.map