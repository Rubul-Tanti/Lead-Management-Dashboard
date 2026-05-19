"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env_config");
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, env_config_1.env.jwt_access_secret, {
        expiresIn: '15m',
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, env_config_1.env.jwt_refresh_secret, {
        expiresIn: '30d',
    });
};
exports.generateRefreshToken = generateRefreshToken;
