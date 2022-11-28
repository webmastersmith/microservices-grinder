import express, { Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import fs from 'fs';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

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
      if (!id || !comment) return res.status(400).json({ status: 'fail' });

      comments[id]
        ? comments[id].push({ id: commentId, comment })
        : (comments[id] = [{ id: commentId, comment }]);

      await axios
        .post('http://localhost:4005/events', {
          type: 'CommentCreated',
          data: { id: commentId, comment, postId: id },
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
      const { type, data } = req.body;
      if (!type || !data) return next();

      console.log(`Event ${type}`);
      res.status(201).json({});
    }
  );

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
})();
