"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = require("mongoose");
const leadSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Lead name is required"],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        required: [true, "Lead email is required"],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please provide a valid email",
        ],
    },
    status: {
        type: String,
        enum: ["new", "contacted", "qualified", "lost"],
        default: "new",
    },
    source: {
        type: String,
        enum: ["website", "instagram", "referral"],
        required: [true, "Lead source is required"],
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
exports.Lead = (0, mongoose_1.model)("Lead", leadSchema);
