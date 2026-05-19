"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.globalErrorHandler = exports.asyncError = exports.ApiError = void 0;
// Custom API Error
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
// Wrapper to catch async errors in routes
const asyncError = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncError = asyncError;
// Global error handler
const globalErrorHandler = (err, req, res) => {
    console.error("Error:", err); // good for debugging
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: "Error",
            message: err.message,
        });
    }
    if (err.name === "ValidationError") {
        return res.status(400).json({
            status: "Error",
            message: "Validation Error",
        });
    }
    if (err.name === "NotFoundError") {
        return res.status(404).json({
            status: "Error",
            message: "Invalid route: " + req.url,
        });
    }
    // Default fallback
    return res.status(500).json({
        status: "Error",
        message: "An unexpected error occurred",
    });
};
exports.globalErrorHandler = globalErrorHandler;
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
};
exports.notFoundHandler = notFoundHandler;
