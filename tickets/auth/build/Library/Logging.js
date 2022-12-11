"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Log {
}
exports.default = Log;
_a = Log;
Log.log = (args) => _a.info(args);
Log.info = (args) => console.log(chalk_1.default.blue(`[${new Date().toLocaleString()}] [INFO]`, typeof args === 'string' ? chalk_1.default.blueBright(args) : args));
Log.warn = (args) => console.log(chalk_1.default.yellow(`[${new Date().toLocaleString()}] [INFO]`, typeof args === 'string' ? chalk_1.default.yellowBright(args) : args));
Log.error = (args) => console.log(chalk_1.default.red(`[${new Date().toLocaleString()}] [INFO]`, typeof args === 'string' ? chalk_1.default.redBright(args) : args));
