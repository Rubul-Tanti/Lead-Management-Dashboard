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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// USER SCHEMA
const userSchema = new mongoose_1.Schema({
    // Auth
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['ADMIN', 'SALE_USERS'],
        default: 'SALE_USERS',
    },
    authProvider: {
        type: String,
        enum: ['EMAIL', 'GOOGLE'],
        default: 'EMAIL',
    },
    googleId: String,
    resetPasswordToken: {
        type: String,
        unique: true,
        sparse: true,
    },
    resetPasswordTokenExpires: Date,
    twoFactorSecret: String,
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },
    // Profile
    profilePicture: String,
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    firstName: String,
    lastName: String,
    phoneNumber: String,
    dateOfBirth: Date,
    // Security
    lastLoginAt: Date,
    lastLoginIp: String,
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lockedUntil: Date,
    isActive: {
        type: Boolean,
        default: true,
    },
    deletedAt: Date,
}, {
    timestamps: true,
});
// INDEXES
userSchema.index({ role: 1 });
userSchema.index({ deletedAt: 1 });
// MODEL
exports.User = mongoose_1.default.models.User ||
    mongoose_1.default.model("User", userSchema);
