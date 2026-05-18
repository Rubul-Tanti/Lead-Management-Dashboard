"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { prisma } from './db/prisma'
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
