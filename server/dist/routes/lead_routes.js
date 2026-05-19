"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadRouter = void 0;
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const errorHandler_1 = require("../middleware/errorHandler");
const Leads_1 = require("../controler/Leads");
exports.leadRouter = express_1.default.Router();
exports.leadRouter.post('/', (0, authentication_1.default)([]), (0, errorHandler_1.asyncError)(Leads_1.createLead));
exports.leadRouter.get("/overview", (0, authentication_1.default)([]), (0, errorHandler_1.asyncError)(Leads_1.getLeadsOverview));
exports.leadRouter.put('/:id', (0, authentication_1.default)([]), (0, errorHandler_1.asyncError)(Leads_1.updateLead));
exports.leadRouter.delete('/:id', (0, authentication_1.default)(['ADMIN']), (0, errorHandler_1.asyncError)(Leads_1.deleteLeadById));
exports.leadRouter.get('/all', (0, authentication_1.default)([]), (0, errorHandler_1.asyncError)(Leads_1.getLeads));
exports.leadRouter.get('/:id', (0, authentication_1.default)([]), (0, errorHandler_1.asyncError)(Leads_1.getLeadById));
