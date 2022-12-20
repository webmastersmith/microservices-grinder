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
const cookie_session_1 = __importDefault(require("cookie-session"));
require("express-async-errors");
require("dotenv/config");
const chalk_1 = __importDefault(require("chalk"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const errors_1 = require("./errors");
const mongoose_1 = __importDefault(require("mongoose"));
const Logging_1 = __importDefault(require("./library/Logging"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.set('trust proxy', true); // for the load balancer. look at first x-forwarded item to get sender.
const port = 4000;
/** Connect to Mongo */
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
    .connect(
// `mongodb://${config.mongo.user}:${config.mongo.password}@mongo-svc:27017/AuthDB`,
`mongodb://${config_1.config.mongo.user}:${config_1.config.mongo.password}@localhost:27017/AuthDB`, 
// `mongodb://${config.mongo.user}:${config.mongo.password}@172.30.71.94:27017/AuthDB`,
{ authSource: 'admin', w: 'majority', retryWrites: true })
    .then(() => {
    Logging_1.default.info('Connected to MongoDB!!!!');
    StartServer();
})
    .catch((e) => {
    throw new errors_1.DatabaseError(errors_1.httpStatusCodes.BAD_REQUEST, e);
});
/** Express Rest API */
function StartServer() {
    return __awaiter(this, void 0, void 0, function* () {
        /** Try Catch Route wrapper */
        // HOF wrapper
        const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
        app.use((req, res, next) => {
            // log incoming request.
            Logging_1.default.info(`Incoming -> Method: [${chalk_1.default.yellow(req.method)}] - Url: [${chalk_1.default.yellow(req.url)}] - IP: [${chalk_1.default.yellow(req.socket.remoteAddress)}]`);
            res.on('finish', () => {
                // log response
                const code = res.statusCode;
                const color = code >= 300 ? chalk_1.default.red : chalk_1.default.green;
                Logging_1.default.info(`Outgoing -> Method: [${chalk_1.default.yellow(req.method)}] - Url: [${chalk_1.default.yellow(req.url)}] - IP: [${chalk_1.default.yellow(req.socket.remoteAddress)}] - StatusCode: [${color(res.statusCode)}]`);
            });
            next();
        });
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.json());
        app.use((0, cookie_session_1.default)({
            signed: false,
            secure: config_1.config.dev.env === 'production' ? true : false
        }));
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
        app.use('/api/v1/users', use(AuthRoutes_1.default));
        /** HealthCheck */
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
