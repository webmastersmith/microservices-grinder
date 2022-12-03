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
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = process.env.PORT;
        const address = process.env.NODE_ENV === 'development' ? 'localhost' : 'events-svc';
        // middleware
        app.use(express_1.default.json());
        // listen for event to create comments with post.
        app.post('/event', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { type, data } = req.body;
            if (type === 'CommentCreated') {
                const status = data.comment.includes('orange')
                    ? 'rejected'
                    : 'approved';
                // console.log('CommentCreated', status);
                // console.log('CommentCreated', { ...data, status });
                yield axios_1.default
                    .post(`http://${address}:4005/events`, {
                    type: 'CommentUpdated',
                    data: Object.assign(Object.assign({}, data), { status }),
                })
                    .catch((err) => {
                    console.log(err.message);
                });
            }
            res.status(201).json({});
            // fs.writeFileSync('./queries.json', JSON.stringify(posts));
            return;
        }));
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://${address}:${port}`);
        });
    });
})();
