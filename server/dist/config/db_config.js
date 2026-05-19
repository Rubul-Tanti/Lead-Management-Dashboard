"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("./env_config");
const logger_1 = __importDefault(require("../utils/logger"));
const ConnectToDb = async () => {
    try {
        await mongoose_1.default.connect(env_config_1.env.databaseUrl);
        logger_1.default.info("connected to DataBASe");
    }
    catch (e) {
        logger_1.default.info("Error while connecting to database", e);
    }
};
exports.ConnectToDb = ConnectToDb;
