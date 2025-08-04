"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const testSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
});
exports.TestModel = mongoose_1.default.model("Test", testSchema);
//# sourceMappingURL=TestModel.js.map