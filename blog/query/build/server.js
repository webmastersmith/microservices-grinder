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
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = process.env.PORT;
        const address = process.env.NODE_ENV === 'development' ? 'localhost' : 'events-svc';
        const posts = {};
        const handleEvent = (event) => {
            const { type, data } = event;
            if (type === 'PostCreated') {
                const { id, title } = data;
                posts[id] = { id, title, comments: [] };
                return;
            }
            if (type === 'CommentCreated') {
                const { postId } = data;
                posts[postId].comments.push(data);
                return;
            }
            if (type === 'CommentUpdated') {
                const { comment, id, postId, status } = data;
                posts[postId].comments = posts[postId].comments.map((c) => c.id === id ? { id, postId, comment, status } : c);
                // console.log('Comment Updated', posts[postId].comments);
                return;
            }
        };
        // middleware
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        app.get('/query', (req, res, next) => {
            // console.log('Query Get Reg', posts);
            res.status(200).json(posts);
            return;
        });
        // listen for event to create comments with post.
        app.post('/event', (req, res, next) => {
            const { type, data } = req.body;
            if (!type || !data)
                return res.status(200).json({});
            handleEvent(req.body);
            res.status(200).json({});
        });
        app.listen(port, () => __awaiter(this, void 0, void 0, function* () {
            console.log(`⚡️[server]: Server is running at http://${address}:${port}`);
            try {
                const res = yield axios_1.default.get(`http://${address}:4005/events`);
                for (const event of res.data.data) {
                    console.log('Processing Event:', event.type);
                    handleEvent(event);
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                }
                else {
                    console.log(String(e));
                }
            }
        }));
    });
})();
