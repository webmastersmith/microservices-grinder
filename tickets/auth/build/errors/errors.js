"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.RouteError = exports.DatabaseError = exports.RequestValidationError = exports.httpStatusCodes = void 0;
exports.httpStatusCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
    SERVICE_UNAVAILABLE: 503,
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
            field: e.param,
        }));
    }
}
exports.RequestValidationError = RequestValidationError;
class DatabaseError extends CustomError {
    constructor(statusCode = exports.httpStatusCodes.INTERNAL_SERVER) {
        super('Database Connection Error');
        this.statusCode = statusCode;
    }
    serializeErrors() {
        return [
            {
                msg: this.message,
                field: 'Database Error',
            },
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
                field: 'Route Error',
            },
        ];
    }
}
exports.RouteError = RouteError;
const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError)
        return res.status(err.statusCode).json({ errors: err.serializeErrors() });
    // generic error
    res.status(exports.httpStatusCodes.BAD_REQUEST).json({
        errors: [
            {
                msg: err.message,
                field: 'error',
            },
        ],
    });
};
exports.errorHandler = errorHandler;