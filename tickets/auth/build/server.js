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
// import morgan from 'morgan';
const chalk_1 = __importDefault(require("chalk"));
const users_1 = __importDefault(require("./routes/users"));
const errors_1 = require("./errors");
const mongoose_1 = __importDefault(require("mongoose"));
const Logging_1 = __importDefault(require("./Library/Logging"));
const config_1 = require("./config");
const app = (0, express_1.default)();
const port = 4000;
/** Connect to Mongo */
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
    .connect(
// `mongodb://root:password@mongo-svc:27017`
`mongodb://${config_1.config.mongo.user}:${config_1.config.mongo.password}@localhost:27017/AuthDB`, { authSource: 'admin', w: 'majority', retryWrites: true })
    .then(() => {
    Logging_1.default.info('Connected to MongoDB!!!');
    StartServer();
})
    .catch((e) => {
    throw new errors_1.DatabaseError(errors_1.httpStatusCodes.BAD_REQUEST, e);
});
/** Express Rest API */
function StartServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // HOF wrapper
        const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
        // only needed for development
        // app.use(morgan('dev'));
        app.use((req, res, next) => {
            // log incoming request.
            Logging_1.default.info(`Incoming -> Method: [${chalk_1.default.yellow(req.method)}] - Url: [${chalk_1.default.yellow(req.url)}] - IP: [${chalk_1.default.yellow(req.socket.remoteAddress)}]`);
            res.on('finish', () => {
                // log response status
                const code = res.statusCode;
                const color = code >= 300 ? chalk_1.default.red : chalk_1.default.green;
                Logging_1.default.info(`Outgoing -> Method: [${chalk_1.default.yellow(req.method)}] - Url: [${chalk_1.default.yellow(req.url)}] - IP: [${chalk_1.default.yellow(req.socket.remoteAddress)}] - StatusCode: [${color(res.statusCode)}]`);
            });
            next();
        });
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.json());
        /** Rules of API */
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if (req.method == 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                return res.status(200).json({});
            }
            next();
        });
        /** Routes */
        // all routes use this
        app.use('/api/v1/users', use(users_1.default));
        /** Healthcheck */
        app.get('/ping', (req, res, next) => {
            res.status(200).json({ message: 'pong' });
        });
        app.all('*', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            throw new errors_1.RouteError();
        }));
        app.use(errors_1.errorHandler);
        app.listen(port, () => {
            Logging_1.default.info(`⚡️[server]: Server is running at https://localhost:${port}`);
        });
    });
}