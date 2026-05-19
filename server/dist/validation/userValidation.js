"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersSchema = exports.updateUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('invalid email address'),
    userName: zod_1.z.string().min(3).max(12),
    password: zod_1.z.string().min(6).max(12),
    otp: zod_1.z.string().min(6)
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('invalid email address'),
    password: zod_1.z.string()
});
exports.updateUserSchema = zod_1.z.object({
    userName: zod_1.z.string().min(3).max(12).optional(),
    firstName: zod_1.z.string().min(1).max(50).optional(),
    lastName: zod_1.z.string().min(1).max(50).optional(),
    phoneNumber: zod_1.z
        .string()
        .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .optional(),
    dateOfBirth: zod_1.z
        .string()
        .datetime({ message: "Invalid date format" })
        .optional(),
    isActive: zod_1.z.boolean().optional()
});
exports.getUsersSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).optional(),
    limit: zod_1.z.coerce.number().min(5).max(50).optional(),
    userName: zod_1.z.string().optional()
});
