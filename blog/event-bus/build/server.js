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
// import { randomBytes } from 'crypto';
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = process.env.PORT;
        // const events: { [key: string]: any } = JSON.parse(
        //   fs.readFileSync('./events.json', 'utf-8')
        // );
        // middleware
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        //  app.get('/events', (req: Request, res: Response, next: NextFunction) => {
        //   res.status(200).json(events);
        // });
        const events = [];
        app.get('/events', (req, res, next) => {
            res.status(201).json({ status: 'success', data: events });
        });
        app.post('/events', (req, res, next) => {
            const event = req.body;
            // const id = randomBytes(4).toString('hex');
            if (!event)
                return res.status(400).json({ status: 'fail', msg: 'No Event found.' });
            console.log('event', event);
            events.push(event);
            axios_1.default.post('http://localhost:4000/event', event).catch((err) => {
                console.log('Event Port 4000', err.message);
            }); // posts
            axios_1.default.post('http://localhost:4001/event', event).catch((err) => {
                console.log('Event Port 4001', err.message);
            }); // comments
            axios_1.default.post('http://localhost:4002/event', event).catch((err) => {
                console.log('Event Port 4002', err.message);
            }); // query
            axios_1.default.post('http://localhost:4003/event', event).catch((err) => {
                console.log('Event Port 4003', err.message);
            }); // query
            // fs.writeFileSync('./post.json', JSON.stringify(events));
            res.status(201).json({ status: 'success', data: event });
        });
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });
    });
})();
