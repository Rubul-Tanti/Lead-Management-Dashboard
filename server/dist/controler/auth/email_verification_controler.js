"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailverification = exports.emailValidation = void 0;
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../../utils/logger"));
const generateOtp_1 = require("../../utils/generateOtp");
const sendOtp_1 = require("../../services/emailService/sendOtp");
const userSchema_1 = require("../../Models/userSchema");
const otpSchema_1 = require("../../Models/otpSchema");
exports.emailValidation = zod_1.z.object({
    email: zod_1.z.email(),
});
const emailverification = async (req, res) => {
    logger_1.default.info("hit emailverification");
    const result = exports.emailValidation.safeParse(req.body);
    if (!result.success) {
        logger_1.default.warn("Invalid email input", {
            error: result.error,
        });
        return res.status(400).json({
            success: false,
            message: "Invalid email",
        });
    }
    const { email } = result.data;
    try {
        // Check if user already exists
        const userAlreadyExist = await userSchema_1.User.findOne({ email });
        if (userAlreadyExist) {
            logger_1.default.warn("user already exist", {
                email,
            });
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        // Check existing OTP
        const existingOtp = await otpSchema_1.Otp.findOne({ email });
        if (existingOtp) {
            const diffMinutes = (Date.now() - existingOtp.createdAt.getTime()) /
                1000 /
                60;
            if (diffMinutes < 5) {
                const remaining = 5 - diffMinutes;
                logger_1.default.warn("OTP rate limit hit", {
                    email,
                });
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${Math.ceil(remaining)} minutes before requesting another OTP`,
                });
            }
            // Remove old OTP
            await otpSchema_1.Otp.deleteMany({ email });
        }
        // Generate OTP
        const otp = (0, generateOtp_1.generateOtp)().toString();
        // Save OTP
        await otpSchema_1.Otp.create({
            email,
            otp,
        });
        // Send Email
        await (0, sendOtp_1.sendOtp)(email, otp);
        logger_1.default.info("OTP sent successfully", {
            email,
        });
        return res.status(200).json({
            success: true,
            message: "If the email exists, an OTP has been sent for verification.",
        });
    }
    catch (error) {
        logger_1.default.error("Email verification error", {
            email,
            error,
        });
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
        });
    }
};
exports.emailverification = emailverification;
