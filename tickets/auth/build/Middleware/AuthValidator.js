"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailPasswordValidate = void 0;
const express_validator_1 = require("express-validator");
exports.emailPasswordValidate = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email must be valid.'),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage('Password length must be at least 2 and less than 20.'),
];
