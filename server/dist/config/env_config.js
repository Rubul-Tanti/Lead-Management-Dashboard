"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("4000"),
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    DATABASE_URL: zod_1.z.string(),
    SMTP_HOST: zod_1.z.string().min(1),
    SMTP_PORT: zod_1.z.coerce.number(), // converts string → number
    EMAIL: zod_1.z.string().email(),
    EMAILPASS: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(5),
    JWT_REFRESH_SECRET: zod_1.z.string().min(5),
    FRONTEND_URL: zod_1.z.string().url(),
    JWT_ACCESS_TOKEN_EXPIRES: zod_1.z.string().default("15m"),
    JWT_REFRESH_TOKEN_EXPIRES: zod_1.z.string().default("30d"),
    CLOUDINARY_API: zod_1.z.string(),
    CLOUDINARY_API_SECRET: zod_1.z.string(),
    CLOUD_NAME: zod_1.z.string(),
});
const parsedEnv = envSchema.parse(process.env);
exports.env = {
    databaseUrl: parsedEnv.DATABASE_URL,
    frontend_url: parsedEnv.FRONTEND_URL,
    port: parsedEnv.PORT,
    node_env: parsedEnv.NODE_ENV,
    smtp_host: parsedEnv.SMTP_HOST,
    smtp_port: parsedEnv.SMTP_PORT,
    email: parsedEnv.EMAIL,
    emailPass: parsedEnv.EMAILPASS,
    jwt_access_secret: parsedEnv.JWT_ACCESS_SECRET,
    jwt_refresh_secret: parsedEnv.JWT_REFRESH_SECRET,
    jwt_access_token_expires: parsedEnv.JWT_ACCESS_TOKEN_EXPIRES,
    jwt_refresh_token_expires: parsedEnv.JWT_REFRESH_TOKEN_EXPIRES,
    cloudinary_api: parsedEnv.CLOUDINARY_API,
    cloudinary_api_secret: parsedEnv.CLOUDINARY_API_SECRET,
    cloud_name: parsedEnv.CLOUD_NAME
};
