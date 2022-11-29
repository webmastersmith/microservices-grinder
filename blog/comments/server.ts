import express, { Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import fs from 'fs';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';
import { CommentType, CommentEventType } from '../client/src/types/comment';

(async function () {
  const app: Express = express();
  const port = process.env.PORT;

  const comments: { [key: string]: any } = JSON.parse(
    fs.readFileSync('./comments.json', 'utf-8')
  );
  // middleware
  app.use(cors());
  app.use(express.json());

  app.get(
    '/posts/:id/comments',
    (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({ status: 'fail', data: 'Post ID missing.' });
      // send empty array to avoid errors.
      res.status(200).json(comments[id] || []);
    }
  );

  app.post(
    '/posts/:id/comments',
    async (req: Request, res: Response, next: NextFunction) => {
      const { comment } = req.body;
      const { id } = req.params;
      const commentId = randomBytes(4).toString('hex');
      if (!id || !comment) return res.status(200).json({ status: 'fail' });

      const allComments = comments[id] || [];
      const newComment = {
        id: commentId,
        comment,
        postId: id,
        status: 'pending',
      };

      allComments.push(newComment);
      comments[id] = allComments;

      await axios
        .post('http://localhost:4005/events', {
          type: 'CommentCreated',
          data: newComment,
        })
        .catch((err) => {
          console.log(err.message);
        });
      console.log('comment', comments[id]);

      fs.writeFileSync('./comments.json', JSON.stringify(comments));
      res.status(201).json({ status: 'success', data: comments[id] });
    }
  );

  app.post(
    '/event',
    async (req: Request, res: Response, next: NextFunction) => {
      const { type, data } = req.body as CommentEventType;
      if (!type || !data) return res.status(200).json({});

      if (type === 'CommentModerated') {
        // find original comment and replace with updated comment.
        const { postId, id, status } = data;
        const allComments: CommentType[] = comments[postId];
        const newComment = allComments.find((comment) => comment.id === id);
        if (newComment) {
          newComment.status = status;
          await axios
            .post('http://localhost:4005/events', {
              type: 'CommentUpdated',
              data: newComment,
            })
            .catch((err) => {
              console.log(err.message);
            });
        }
      }
      res.status(200).json({});
    }
  );

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
})();
