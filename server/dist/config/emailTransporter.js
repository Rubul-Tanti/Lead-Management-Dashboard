"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = require("./env_config");
exports.emailTransporter = nodemailer_1.default.createTransport({
    host: env_config_1.env.smtp_host,
    port: Number(env_config_1.env.smtp_port),
    secure: Number(env_config_1.env.port) === 465,
    auth: {
        user: env_config_1.env.email,
        pass: env_config_1.env.emailPass,
    },
});
