"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEmailPassword = exports.emailPassword = void 0;
const errors_1 = require("../errors");
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(ajv);
const emailPasswordSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password' }
    },
    required: ['email', 'password'],
    additionalProperties: false
};
exports.emailPassword = ajv.compile(emailPasswordSchema);
const ValidateEmailPassword = (emailPassword) => {
    return (req, res, next) => {
        const valid = emailPassword(req.body);
        if (!valid) {
            return next(new errors_1.AjvValidationError(emailPassword.errors, 400));
        }
        next();
    };
};
exports.ValidateEmailPassword = ValidateEmailPassword;
