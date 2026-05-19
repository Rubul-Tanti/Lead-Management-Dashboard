"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetPasswordToken = exports.HashResetPasswordToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const HashResetPasswordToken = (url) => {
    return crypto_1.default.createHash('sha256').update(url).digest('hex');
};
exports.HashResetPasswordToken = HashResetPasswordToken;
const generateResetPasswordToken = () => {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const hashedToken = (0, exports.HashResetPasswordToken)(token);
    return { token, hashedToken };
};
exports.generateResetPasswordToken = generateResetPasswordToken;
