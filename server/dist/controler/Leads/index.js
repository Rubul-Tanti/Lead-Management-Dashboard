"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadsOverview = exports.deleteLeadById = exports.getLeadById = exports.getLeads = exports.updateLead = exports.createLead = void 0;
const leadsSchema_1 = require("../../Models/leadsSchema");
const leadsValidation_1 = require("../../validation/leadsValidation");
const logger_1 = __importDefault(require("../../utils/logger"));
const errorHandler_1 = require("../../middleware/errorHandler");
const createLead = async (req, res) => {
    try {
        const vr = leadsValidation_1.createLeadsSchema.safeParse(req.body);
        if (!vr.success) {
            return res.status(400).json({
                message: "Input validation error",
                error: vr.error.flatten().fieldErrors,
            });
        }
        const alreadyExist = await leadsSchema_1.Lead.findOne({
            email: vr.data.email,
        });
        if (alreadyExist) {
            return res.status(409).json({
                message: "Lead with email already exists",
                data: alreadyExist,
            });
        }
        const newLead = await leadsSchema_1.Lead.create({
            ...vr.data,
            createdBy: req.user?.id,
        });
        logger_1.default.info("Lead created successfully");
        return res.status(201).json({
            message: "Lead created successfully",
            data: newLead,
        });
    }
    catch (e) {
        logger_1.default.error("Error while creating lead", e);
        if (e instanceof errorHandler_1.ApiError) {
            throw e;
        }
        throw new errorHandler_1.ApiError("Internal server error", 500);
    }
};
exports.createLead = createLead;
const updateLead = async (req, res) => {
    try {
        const id = req.params.id;
        const vr = leadsValidation_1.updateLeadsSchema.safeParse(req.body);
        if (!vr.success) {
            return res.status(400).json({
                message: "Input validation error",
                error: vr.error.flatten().fieldErrors,
            });
        }
        const existingLead = await leadsSchema_1.Lead.findById(id);
        if (!existingLead) {
            throw new errorHandler_1.ApiError("Lead not found", 404);
        }
        const updatedLead = await leadsSchema_1.Lead.findByIdAndUpdate(id, vr.data, {
            new: true,
            runValidators: true,
        });
        logger_1.default.info("Lead updated successfully");
        return res.status(200).json({
            message: "Lead updated successfully",
            data: updatedLead,
        });
    }
    catch (e) {
        logger_1.default.error("Error while updating lead", e);
        if (e instanceof errorHandler_1.ApiError) {
            throw e;
        }
        throw new errorHandler_1.ApiError("Internal server error", 500);
    }
};
exports.updateLead = updateLead;
const getLeads = async (req, res) => {
    try {
        const vr = leadsValidation_1.leadsFilterSchema.safeParse(req.query);
        if (!vr.success) {
            return res.status(400).json({
                message: "Input validation error",
                error: vr.error.flatten().fieldErrors,
            });
        }
        const { page = 1, limit = 10, search, source, status, sort = "latest", } = vr.data;
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (source) {
            filter.source = source;
        }
        // search by name or email
        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
        // sorting
        let sortOption = {};
        if (sort === "latest") {
            sortOption = { createdAt: -1 };
        }
        else if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }
        const leads = await leadsSchema_1.Lead.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        const total = await leadsSchema_1.Lead.countDocuments(filter);
        return res.status(200).json({
            message: "Leads fetched successfully",
            data: leads,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (e) {
        logger_1.default.error("Error while fetching leads", e);
        if (e instanceof errorHandler_1.ApiError) {
            throw e;
        }
        throw new errorHandler_1.ApiError("Internal server error", 500);
    }
};
exports.getLeads = getLeads;
const getLeadById = async (req, res) => {
    try {
        const id = req.params.id;
        const lead = await leadsSchema_1.Lead.findById(id);
        if (!lead) {
            throw new errorHandler_1.ApiError("Lead not found", 404);
        }
        return res.status(200).json({
            message: "Lead fetched successfully",
            data: lead,
        });
    }
    catch (e) {
        logger_1.default.error("Error while fetching lead", e);
        if (e instanceof errorHandler_1.ApiError) {
            throw e;
        }
        throw new errorHandler_1.ApiError("Internal server error", 500);
    }
};
exports.getLeadById = getLeadById;
const deleteLeadById = async (req, res) => {
    try {
        const id = req.params.id;
        const lead = await leadsSchema_1.Lead.findById(id);
        if (!lead) {
            throw new errorHandler_1.ApiError("Lead not found", 404);
        }
        await leadsSchema_1.Lead.findByIdAndDelete(id);
        logger_1.default.info("Lead deleted successfully");
        return res.status(200).json({
            message: "Lead deleted successfully",
        });
    }
    catch (e) {
        logger_1.default.error("Error while deleting lead", e);
        if (e instanceof errorHandler_1.ApiError) {
            throw e;
        }
        throw new errorHandler_1.ApiError("Internal server error", 500);
    }
};
exports.deleteLeadById = deleteLeadById;
const getLeadsOverview = async (req, res) => {
    try {
        console.log("Hit getLeadsOverview controller");
        const newLeads = await leadsSchema_1.Lead.countDocuments({ status: "new" });
        const contactedLeads = await leadsSchema_1.Lead.countDocuments({ status: "contacted" });
        const qualifiedLeads = await leadsSchema_1.Lead.countDocuments({ status: "qualified" });
        const lostLeads = await leadsSchema_1.Lead.countDocuments({ status: "lost" });
        return res.status(200).json({
            message: "Leads overview fetched successfully",
            data: {
                newLeads,
                contactedLeads,
                qualifiedLeads,
                lostLeads,
            },
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.getLeadsOverview = getLeadsOverview;
