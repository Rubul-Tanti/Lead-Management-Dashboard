"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWithGoogle = void 0;
const errorHandler_1 = require("../../middleware/errorHandler");
const logger_1 = __importDefault(require("../../utils/logger"));
const userSchema_1 = require("../../Models/userSchema");
const generateToken_1 = require("../../utils/generateToken");
const registerWithGoogle = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            logger_1.default.warn("google auth failed: token missing");
            return res.status(400).json({ success: false, message: "token not found" });
        }
        const googleResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!googleResponse.ok) {
            logger_1.default.error("google auth failed: invalid token response from google");
            return res.status(401).json({ message: "invalid token" });
        }
        const googleUser = await googleResponse.json();
        if (!googleUser.email_verified) {
            logger_1.default.warn(`google auth rejected: email not verified for ${googleUser.email}`);
            return res.status(403).json({
                success: false,
                message: "google email not verified try different gmail",
            });
        }
        const existingUser = await userSchema_1.User.findOne({
            $or: [{ email: googleUser.email }, { googleId: googleUser.sub }],
        });
        if (existingUser) {
            const access_token = await (0, generateToken_1.generateAccessToken)(existingUser._id.toString());
            const refresh_token = await (0, generateToken_1.generateRefreshToken)(existingUser._id.toString());
            logger_1.default.info(`google login success for ${existingUser.email}`);
            return res
                .status(200)
                .cookie("refresh_token", refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            })
                .json({
                success: true,
                message: "login successful",
                data: {
                    userName: existingUser.userName,
                    email: existingUser.email,
                    role: existingUser.role,
                    profilePicture: existingUser.profilePicture,
                },
                access_token,
            });
        }
        const newUser = await userSchema_1.User.create({
            userName: googleUser.name,
            email: googleUser.email,
            profilePicture: googleUser.picture,
            googleId: googleUser.sub,
            authProvider: 'GOOGLE',
            role: 'SALE_USERS',
        });
        if (!newUser) {
            throw new errorHandler_1.ApiError("");
            return;
        }
        const access_token = await (0, generateToken_1.generateAccessToken)(newUser._id.toString());
        const refresh_token = await (0, generateToken_1.generateRefreshToken)(newUser._id.toString());
        logger_1.default.info(`google account created for ${newUser.email}`);
        return res
            .status(201)
            .cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })
            .json({
            success: true,
            message: "user created successfully",
            data: {
                userName: newUser.userName,
                email: newUser.email,
                role: newUser.role,
                profilePicture: newUser.profilePicture,
            },
            access_token,
        });
    }
    catch (error) {
        logger_1.default.error("error while registering with google", error);
        throw new errorHandler_1.ApiError("internal server error", 500);
    }
};
exports.registerWithGoogle = registerWithGoogle;
