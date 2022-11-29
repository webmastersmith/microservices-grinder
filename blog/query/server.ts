import express, { Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import fs from 'fs';
// import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';
import {
  CommentType,
  CommentEventType,
  QueryType,
  PostsEventType,
  PostsType,
} from '../client/src/types/comment';

(async function () {
  const app: Express = express();
  const port = process.env.PORT;

  const posts: { [key: string]: QueryType } = JSON.parse(
    fs.readFileSync('./queries.json', 'utf-8')
  );

  // middleware
  app.use(express.json());
  app.use(cors());

  app.get('/query', (req: Request, res: Response, next: NextFunction) => {
    console.log('Query Get Reg', posts);
    res.status(200).json(posts);
    return;
  });

  // listen for event to create comments with post.
  app.post('/event', (req: Request, res: Response, next: NextFunction) => {
    const { type, data } = req.body;
    if (!type || !data) return res.status(200).json({});
    console.log('Query Event', { type, data });

    if (type === 'PostCreated') {
      const { id, title } = data as PostsType;
      posts[id] = { id, title, comments: [] };
      res.status(201).json({});
      fs.writeFileSync('./queries.json', JSON.stringify(posts));
      return;
    }

    // if (!posts[data.postId]) return res.status(200).json({});
    if (type === 'CommentCreated') {
      const { postId } = data as CommentType;
      posts[postId].comments.push(data);

      res.status(201).json({});
      fs.writeFileSync('./queries.json', JSON.stringify(posts));
      return;
    }

    if (type === 'CommentUpdated') {
      const { comment, id, postId, status } = data as CommentType;

      posts[postId].comments = posts[postId].comments.map((c) =>
        c.id === id ? { id, postId, comment, status } : c
      );
      res.status(201).json({});
      fs.writeFileSync('./queries.json', JSON.stringify(posts));
    }

    res.status(200).json({});
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
})();
