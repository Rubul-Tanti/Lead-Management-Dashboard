"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordChange = void 0;
const resetPasswordToken_1 = require("../../utils/resetPasswordToken");
const hashPassword_1 = require("../../utils/hashPassword");
const email_verification_controler_1 = require("./email_verification_controler");
const zod_1 = require("zod");
const errorHandler_1 = require("../../middleware/errorHandler");
const logger_1 = __importDefault(require("../../utils/logger"));
const resetPasswordToken_2 = require("../../utils/resetPasswordToken");
const sendResetToken_1 = __importDefault(require("../../services/emailService/sendResetToken"));
const user_controler_1 = require("../user/user_controler");
const userSchema_1 = require("../../Models/userSchema");
// REQUEST PASSWORD CHANGE
const requestPasswordChange = async (req, res) => {
    try {
        const validationResult = email_verification_controler_1.emailValidation.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "validation error",
                error: validationResult.error.flatten(),
            });
        }
        const { email } = validationResult.data;
        // Find User
        const user = await userSchema_1.User.findOne({
            email,
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found",
            });
        }
        // Generate Reset Token
        const { token, hashedToken } = (0, resetPasswordToken_2.generateResetPasswordToken)();
        // Update User
        user.resetPasswordToken =
            hashedToken;
        user.resetPasswordTokenExpires =
            new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        // Send Email
        await (0, sendResetToken_1.default)(token, email);
        return res.status(200).json({
            success: true,
            message: "If an account exists with this email, a password reset link has been sent.",
            data: (0, user_controler_1.getsafeUser)(user),
        });
    }
    catch (e) {
        logger_1.default.error("error while requesting password reset", e);
        throw new errorHandler_1.ApiError("internal server error", 500);
    }
};
exports.requestPasswordChange = requestPasswordChange;
// VALIDATION
const validationSchema = zod_1.z.object({
    url: zod_1.z.string(),
    newPassword: zod_1.z
        .string()
        .min(3)
        .max(12),
    email: zod_1.z
        .string()
        .email("invalid email"),
});
// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const validationResult = validationSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "validation error",
                error: validationResult.error.flatten(),
            });
        }
        const { email, url, newPassword, } = validationResult.data;
        // Hash Reset Token
        const token = (0, resetPasswordToken_1.HashResetPasswordToken)(url);
        // Find User
        const user = await userSchema_1.User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordTokenExpires: {
                $gt: new Date(),
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "reset token expired please try again",
            });
        }
        // Hash Password
        const hashedPassword = await (0, hashPassword_1.hashPassword)(newPassword);
        // Update User
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires =
            undefined;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "password reset successfully",
            data: (0, user_controler_1.getsafeUser)(user),
        });
    }
    catch (e) {
        console.log(e);
        throw new errorHandler_1.ApiError("internal server error", 500);
    }
};
exports.resetPassword = resetPassword;
