"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const env_config_1 = require("./env_config");
exports.corsConfig = {
    origin: (origin, callback) => {
        const allowedDomains = ['http://localhost:5173', env_config_1.env.frontend_url];
        if (!origin || allowedDomains.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not Allowed By Cors'));
        }
    },
    methods: ['PUT', 'POST', 'PATCH', 'GET', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Version'],
    exposedHeaders: ['X-Total-Count', 'Content-Range'],
    preflightContinue: false,
    credentials: true,
};
