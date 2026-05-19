"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const errorHandler_1 = require("../middleware/errorHandler");
const user_controler_1 = require("../controler/user/user_controler");
const userRouter = express_1.default.Router();
userRouter.get("/", (0, authentication_1.default)(['ADMIN']), (0, errorHandler_1.asyncError)(user_controler_1.getUsers));
userRouter.put("/asign-role/:id", (0, authentication_1.default)(['ADMIN']), (0, errorHandler_1.asyncError)(user_controler_1.assignRole));
userRouter.delete('/:id', (0, authentication_1.default)(['ADMIN']), (0, errorHandler_1.asyncError)(user_controler_1.deleteUser));
exports.default = userRouter;
