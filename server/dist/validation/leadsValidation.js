"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsFilterSchema = exports.updateLeadsSchema = exports.createLeadsSchema = void 0;
const zod_1 = require("zod");
exports.createLeadsSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(200),
    email: zod_1.z.string().email(),
    status: zod_1.z.enum(["new", "contacted", "qualified", "lost"]),
    source: zod_1.z.enum(["website", "instagram", "referral"])
});
exports.updateLeadsSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(200).optional(),
    email: zod_1.z.string().email().optional(),
    status: zod_1.z.enum(["new", "contacted", "qualified", "lost"]).optional(),
    source: zod_1.z.enum(["website", "instagram", "referral"]).optional()
});
exports.leadsFilterSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).optional(),
    limit: zod_1.z.coerce.number().min(5).max(50).optional(),
    status: zod_1.z.enum(["new", "contacted", "qualified", "lost"]).optional(),
    source: zod_1.z.enum(["website", "instagram", "referral"]).optional(),
    search: zod_1.z.string().optional(),
    sort: zod_1.z.enum(['latest', 'oldest']).optional()
});
