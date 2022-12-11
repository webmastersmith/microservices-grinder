"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const users_1 = __importDefault(require("./routes/users"));
const errors_1 = require("./errors");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = 4000;
app.use(express_1.default.json());
// only needed for development
app.use((0, morgan_1.default)('dev'));
// all routes use this
app.use('/api/v1/users', users_1.default);
app.all('*', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    throw new errors_1.RouteError();
}));
app.use(errors_1.errorHandler);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            mongoose_1.default.set('strictQuery', false);
            const db = yield mongoose_1.default.connect(
            // `mongodb://root:password@mongo-svc:27017`
            `mongodb://root:password@localhost:27017`);
            console.log('Connected to MongoDB!!!');
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new errors_1.DatabaseError(e);
            }
            else {
                console.log(String(e));
                throw new Error();
            }
        }
        finally {
            // db.disconnect(); // for http servers stays running to validate api request.
            // console.log('Closed Client');
        }
    });
}
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
start();
