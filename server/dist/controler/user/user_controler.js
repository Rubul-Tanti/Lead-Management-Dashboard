"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.assignRole = exports.getUsers = exports.updateUser = exports.logout = exports.refreshUser = exports.LoginUser = exports.registerUser = exports.getsafeUser = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const userValidation_1 = require("../../validation/userValidation");
const hashPassword_1 = require("../../utils/hashPassword");
const userValidation_2 = require("../../validation/userValidation");
const hashPassword_2 = require("../../utils/hashPassword");
const generateToken_1 = require("../../utils/generateToken");
const logger_1 = __importDefault(require("../../utils/logger"));
const userSchema_1 = require("../../Models/userSchema");
const otpSchema_1 = require("../../Models/otpSchema");
const errorHandler_1 = require("../../middleware/errorHandler");
const env_config_1 = require("../../config/env_config");
const getsafeUser = (user) => {
    return {
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
        id: user._id,
        phoneNumber: user.phoneNumber,
        userName: user.userName,
    };
};
exports.getsafeUser = getsafeUser;
const registerUser = async (req, res) => {
    logger_1.default.info("hit register user");
    try {
        const validationResult = userValidation_2.registerUserSchema.safeParse(req.body);
        if (!validationResult.success) {
            logger_1.default.error("validation failed at register user", req.body);
            return res.status(400).json({
                success: false,
                message: validationResult.error.flatten(),
            });
        }
        const { email, password, otp, userName, } = validationResult.data;
        // Check existing user
        const userAlreadyExist = await userSchema_1.User.findOne({
            email,
        });
        if (userAlreadyExist) {
            logger_1.default.warn("user already exist");
            return res.status(400).json({
                success: false,
                message: "user already exist",
            });
        }
        // Verify OTP
        const otpObj = await otpSchema_1.Otp.findOne({
            email,
            otp,
        });
        if (!otpObj) {
            return res.status(402).json({
                success: false,
                message: "otp does not match",
            });
        }
        // Check OTP expiration
        const now = Date.now();
        const createdAt = otpObj.createdAt.getTime();
        const remainingTime = (now - createdAt) / 1000 / 60;
        if (remainingTime > 5) {
            await otpSchema_1.Otp.deleteMany({ email });
            return res.status(402).json({
                success: false,
                message: "otp expired, please try again later",
            });
        }
        // Hash password
        const hashedPassword = await (0, hashPassword_2.hashPassword)(password);
        // Create user
        const newUser = await userSchema_1.User.create({
            email,
            userName,
            password: hashedPassword,
            authProvider: 'EMAIL'
        });
        logger_1.default.info("new user created", {
            id: newUser._id,
            email: newUser.email,
        });
        // Delete OTP after successful registration
        await otpSchema_1.Otp.deleteMany({ email });
        // Generate tokens
        const access_token = await (0, generateToken_1.generateAccessToken)(newUser._id.toString());
        const refresh_token = await (0, generateToken_1.generateRefreshToken)(newUser._id.toString());
        return res
            .status(200)
            .cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: true,
        })
            .json({
            success: true,
            message: "user created successfully",
            data: (0, exports.getsafeUser)(newUser),
            access_token,
        });
    }
    catch (e) {
        logger_1.default.error("error registering user", e);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
};
exports.registerUser = registerUser;
// LOGIN USER
const LoginUser = async (req, res) => {
    try {
        const validationResult = userValidation_1.loginUserSchema.safeParse(req.body);
        if (!validationResult.success) {
            logger_1.default.warn("error while validation", validationResult.error.flatten());
            return res.status(400).json({
                success: false,
                error: validationResult.error.flatten(),
                message: "validation error",
            });
        }
        const { email, password } = validationResult.data;
        // Find User
        const user = await userSchema_1.User.findOne({
            email,
            authProvider: 'EMAIL',
        });
        if (!user) {
            logger_1.default.warn("email or password is incorrect");
            return res.status(401).json({
                success: false,
                message: "email or password is incorrect",
            });
        }
        // Compare Password
        const matchedPassword = await (0, hashPassword_1.comparePassword)(password, user.password || "");
        if (!matchedPassword) {
            logger_1.default.warn("email or password is incorrect");
            return res.status(401).json({
                success: false,
                message: "email or password is incorrect",
            });
        }
        // Generate Tokens
        const access_token = (0, generateToken_1.generateAccessToken)(user._id.toString());
        const refresh_token = (0, generateToken_1.generateRefreshToken)(user._id.toString());
        logger_1.default.info("login successfully", {
            id: user._id,
        });
        return res
            .status(200)
            .cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: true,
        })
            .json({
            success: true,
            message: "login successfully",
            data: (0, exports.getsafeUser)(user),
            access_token,
        });
    }
    catch (e) {
        logger_1.default.error("error while login user", e);
        throw new errorHandler_1.ApiError("internal server error", 500);
    }
};
exports.LoginUser = LoginUser;
// REFRESH USER
const refreshUser = async (req, res) => {
    try {
        logger_1.default.info("hit refresh user");
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "no refresh token found",
            });
        }
        // Verify Token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, env_config_1.env.jwt_refresh_secret);
        // Find User
        const user = await userSchema_1.User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }
        // Generate New Tokens
        const access_token = (0, generateToken_1.generateAccessToken)(user._id.toString());
        const new_refresh_token = (0, generateToken_1.generateRefreshToken)(user._id.toString());
        return res
            .status(200)
            .cookie("refresh_token", new_refresh_token, {
            httpOnly: true,
            secure: true,
        })
            .json({
            success: true,
            message: "refresh successfully",
            data: (0, exports.getsafeUser)(user),
            access_token,
        });
    }
    catch (e) {
        console.log(e);
        if (e instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "token expired",
            });
        }
        if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "invalid token",
            });
        }
        throw new errorHandler_1.ApiError("internal server error", 500);
    }
};
exports.refreshUser = refreshUser;
const logout = async (req, res) => {
    logger_1.default.info("Hit logout controller");
    try {
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (e) {
        logger_1.default.error("Error while logout", e);
        throw new errorHandler_1.ApiError("Internal Server Error", 500);
    }
};
exports.logout = logout;
const updateUser = async () => { };
exports.updateUser = updateUser;
const getUsers = async (req, res) => {
    try {
        const validationResult = userValidation_1.getUsersSchema.safeParse(req.query);
        if (!validationResult.success) {
            logger_1.default.error("validation failed at get users", validationResult.error.flatten());
            return res.status(400).json({
                success: false,
                message: "Input validation error",
                error: validationResult.error.flatten(),
            });
        }
        const { page = 1, limit = 10, userName = "", } = validationResult.data;
        const users = await userSchema_1.User.find({
            userName: {
                $regex: userName,
                $options: "i",
            },
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .select("-password");
        const totalUsers = await userSchema_1.User.countDocuments({
            userName: {
                $regex: userName,
                $options: "i",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
            pagination: {
                total: totalUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit),
            },
        });
    }
    catch (e) {
        throw new errorHandler_1.ApiError("Internal Server Error", 500);
    }
};
exports.getUsers = getUsers;
const assignRole = async (req, res) => {
    try {
        const id = req.params.id;
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required",
            });
        }
        const exists = await userSchema_1.User.findById(id);
        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const updatedUser = await userSchema_1.User.findByIdAndUpdate(id, { role }, {
            new: true,
        }).select("-password");
        return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: updatedUser,
        });
    }
    catch (e) {
        throw new errorHandler_1.ApiError("Internal Server Error", 500);
    }
};
exports.assignRole = assignRole;
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const exists = await userSchema_1.User.findById(id);
        if (!exists) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        if (exists.role === "ADMIN") {
            return res.status(400).json({ message: "Admin user cannot be deleted", success: false });
        }
        await userSchema_1.User.findByIdAndDelete(id);
        return res.status(200).json({ message: "User deleted successfully", success: true });
    }
    catch (e) {
        throw new errorHandler_1.ApiError("Internal Server Error", 500);
    }
};
exports.deleteUser = deleteUser;
