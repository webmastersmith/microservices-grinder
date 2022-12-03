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
const crypto_1 = require("crypto");
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = process.env.PORT;
        const address = process.env.NODE_ENV === 'development' ? 'localhost' : 'events-svc';
        const comments = {};
        // middleware
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.get('/posts/:id/comments', (req, res, next) => {
            console.log('Comments Get', req.params.id);
            const { id } = req.params;
            if (!id)
                return res
                    .status(400)
                    .json({ status: 'fail', data: 'Post ID missing.' });
            // send empty array to avoid errors.
            res.status(200).json(comments[id] || []);
        });
        app.post('/posts/:id/comments', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { comment } = req.body;
            const { id } = req.params;
            const commentId = (0, crypto_1.randomBytes)(4).toString('hex');
            if (!id || !comment)
                return res.status(200).json({ status: 'fail' });
            const allComments = comments[id] || [];
            const newComment = {
                id: commentId,
                comment,
                postId: id,
                status: 'pending',
            };
            allComments.push(newComment);
            comments[id] = allComments;
            yield axios_1.default
                .post(`http://${address}:4005/events`, {
                type: 'CommentCreated',
                data: newComment,
            })
                .catch((err) => {
                console.log(err.message);
            });
            console.log('comment', comments[id]);
            // fs.writeFileSync('./comments.json', JSON.stringify(comments));
            res.status(201).json({ status: 'success', data: comments[id] });
        }));
        app.post('/event', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { type, data } = req.body;
            if (!type || !data)
                return res.status(200).json({});
            if (type === 'CommentModerated') {
                // find original comment and replace with updated comment.
                const { postId, id, status } = data;
                const allComments = comments[postId];
                const newComment = allComments.find((comment) => comment.id === id);
                if (newComment) {
                    newComment.status = status;
                    yield axios_1.default
                        .post(`http://${address}:4005/events`, {
                        type: 'CommentUpdated',
                        data: newComment,
                    })
                        .catch((err) => {
                        console.log(err.message);
                    });
                }
            }
            res.status(200).json({});
        }));
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://${address}:${port}`);
        });
    });
})();
