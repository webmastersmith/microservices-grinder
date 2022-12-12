"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.RouteError = exports.DatabaseError = exports.AjvValidationError = exports.JoiValidationError = exports.RequestValidationError = exports.httpStatusCodes = void 0;
const Logging_1 = __importDefault(require("../library/Logging"));
exports.httpStatusCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
    SERVICE_UNAVAILABLE: 503
};
// this will keep enforcing error schema after TS is translated.
class CustomError extends Error {
    constructor(message) {
        super(message);
        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
        // this allows 'instanceof' to correctly identify between Error and YourErrorName.
        // all extended classes will correctly identify with this code.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class RequestValidationError extends CustomError {
    constructor(statusCode = exports.httpStatusCodes.BAD_REQUEST, errors) {
        super('Express-Validator Error.');
        this.statusCode = statusCode;
        this.errors = errors;
    }
    serializeErrors() {
        return this.errors.map((e) => ({
            msg: e.msg,
            field: e.param
        }));
    }
}
exports.RequestValidationError = RequestValidationError;
class JoiValidationError extends CustomError {
    constructor(error) {
        super('Joi-Validation Error.');
        this.error = error;
        this.statusCode = exports.httpStatusCodes.BAD_REQUEST;
    }
    // serializeErrors() {
    //   return this.errors.map((e) => ({
    //     msg: '',
    //     field: ''
    //   }));
    // }
    serializeErrors() {
        return [
            {
                msg: this.message,
                field: 'Database Error',
                err: this.error
            }
        ];
    }
}
exports.JoiValidationError = JoiValidationError;
class AjvValidationError extends CustomError {
    // attaches statusCode and Errors Array to error.
    constructor(errors, statusCode = exports.httpStatusCodes.BAD_REQUEST) {
        super('Ajv-Validation Error.');
        this.errors = errors;
        this.statusCode = statusCode;
    }
    serializeErrors() {
        return this.errors.map((e) => ({
            msg: e.message,
            field: e.params
        }));
    }
}
exports.AjvValidationError = AjvValidationError;
class DatabaseError extends CustomError {
    constructor(statusCode = exports.httpStatusCodes.INTERNAL_SERVER, err) {
        super('Database Connection Error');
        this.statusCode = statusCode;
        this.err = err;
    }
    serializeErrors() {
        var _a;
        return [
            {
                msg: this.message,
                field: 'Database Error',
                err: ((_a = this.err) === null || _a === void 0 ? void 0 : _a.stack) || ''
            }
        ];
    }
}
exports.DatabaseError = DatabaseError;
class RouteError extends CustomError {
    constructor(statusCode = exports.httpStatusCodes.NOT_FOUND) {
        super('Route Not Found.');
        this.statusCode = statusCode;
    }
    serializeErrors() {
        return [
            {
                msg: this.message,
                field: 'Route Error'
            }
        ];
    }
}
exports.RouteError = RouteError;
const errorHandler = (err, req, res, next) => {
    // if (err instanceof AjvValidationError) {
    //   Log.error(JSON.stringify(err, null, 2));
    //   return res.status(err.statusCode).json({ errors: err.serializeErrors() });
    // }
    if (err instanceof JoiValidationError) {
        Logging_1.default.error(JSON.stringify(err, null, 2));
        return res.status(err.statusCode).json({ errors: err });
    }
    Logging_1.default.error(err.stack);
    if (err instanceof CustomError)
        return res.status(err.statusCode).json({ errors: err.serializeErrors() });
    // generic error
    res.status(exports.httpStatusCodes.BAD_REQUEST).json({
        errors: [
            {
                msg: err.message,
                field: 'error'
            }
        ]
    });
};
exports.errorHandler = errorHandler;
