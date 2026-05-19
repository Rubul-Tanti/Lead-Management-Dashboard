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
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const env_config_1 = require("../config/env_config");
const userSchema_1 = require("../Models/userSchema");
const user_controler_1 = require("../controler/user/user_controler");
const generateToken_1 = require("../utils/generateToken");
// HELPERS
const extractBearerToken = (req) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        return null;
    const token = header.split(" ")[1];
    return token?.trim() || null;
};
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_config_1.env.jwt_access_secret);
};
// LOGIN ROUTE HANDLER
const handleLoginRoute = async (req, res, next) => {
    const token = extractBearerToken(req);
    if (!token) {
        next();
        return;
    }
    try {
        const { userId } = verifyToken(token);
        const user = await userSchema_1.User.findById(userId);
        if (!user) {
            res.status(401).json({
                message: "User not found",
            });
            return;
        }
        const access_token = (0, generateToken_1.generateAccessToken)(user._id.toString());
        const refresh_token = (0, generateToken_1.generateRefreshToken)(user._id.toString());
        res
            .status(200)
            .cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: true,
        })
            .json({
            success: true,
            message: "Login successful",
            data: (0, user_controler_1.getsafeUser)(user),
            access_token,
        });
    }
    catch (e) {
        if (e instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(401).json({
                message: "Token expired",
            });
            return;
        }
        if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(401).json({
                message: "Invalid token",
            });
            return;
        }
        next();
    }
};
// AUTHORIZATION
const authorizationMiddleware = (requiredRole) => {
    return async (req, res, next) => {
        // Login Route Check
        if (req.originalUrl.startsWith("/api/auth/login")) {
            await handleLoginRoute(req, res, next);
            return;
        }
        const token = extractBearerToken(req);
        if (!token) {
            res.status(401).json({
                message: "No authorization header found",
            });
            return;
        }
        try {
            const { userId } = verifyToken(token);
            const user = await userSchema_1.User.findById(userId);
            if (!user) {
                res.status(401).json({
                    message: "User not found",
                });
                return;
            }
            // Role Check
            if (requiredRole.length > 0 &&
                !requiredRole.includes(user.role)) {
                res.status(403).json({
                    message: "Insufficient permissions",
                });
                return;
            }
            req.user = {
                id: user._id.toString(),
                role: user.role,
                email: user.email,
            };
            next();
        }
        catch (e) {
            if (e instanceof jsonwebtoken_1.TokenExpiredError) {
                res.status(401).json({
                    message: "Token expired",
                });
                return;
            }
            if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
                res.status(401).json({
                    message: "Invalid token",
                });
                return;
            }
            res.status(500).json({
                message: "Internal server error",
            });
        }
    };
};
exports.default = authorizationMiddleware;
