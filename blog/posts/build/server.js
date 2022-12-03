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
// import fs from 'fs';
const crypto_1 = require("crypto");
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = process.env.PORT;
        const posts = {};
        // middleware
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        app.get('/posts', (req, res, next) => {
            res.status(200).json(posts);
        });
        app.post('/posts', (req, res, next) => {
            const { title } = req.body;
            console.log('req.body', req.body);
            console.log('title', title);
            const id = (0, crypto_1.randomBytes)(4).toString('hex');
            if (!title)
                return res
                    .status(400)
                    .json({ status: 'fail', msg: 'Post needs a title.', data: title });
            posts[id] = { id, title };
            const event = {
                type: 'PostCreated',
                data: posts[id],
            };
            // send to event bus
            axios_1.default.post('http://localhost:4005/events', event).catch((err) => {
                console.log(err.message);
            });
            res.status(201).json({ status: 'success', data: posts[id] });
        });
        app.post('/event', (req, res, next) => {
            const { type, data } = req.body;
            // const id = randomBytes(4).toString('hex');
            if (!type || !data)
                return res.status(200).json({});
            console.log(`Event ${type}`);
            res.status(201).json({});
        });
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });
    });
})();
