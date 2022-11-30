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
  AllEventTypes,
} from '../client/src/types/comment';

(async function () {
  const app: Express = express();
  const port = process.env.PORT;

  const posts: { [key: string]: QueryType } = {};

  const handleEvent = (event: AllEventTypes) => {
    const { type, data } = event;

    if (type === 'PostCreated') {
      const { id, title } = data as PostsType;
      posts[id] = { id, title, comments: [] };
      return;
    }

    if (type === 'CommentCreated') {
      const { postId } = data as CommentType;
      posts[postId].comments.push(data as CommentType);
      return;
    }

    if (type === 'CommentUpdated') {
      const { comment, id, postId, status } = data as CommentType;
      posts[postId].comments = posts[postId].comments.map((c) =>
        c.id === id ? { id, postId, comment, status } : c
      );
      // console.log('Comment Updated', posts[postId].comments);
      return;
    }
  };

  // middleware
  app.use(express.json());
  app.use(cors());

  app.get('/query', (req: Request, res: Response, next: NextFunction) => {
    // console.log('Query Get Reg', posts);
    res.status(200).json(posts);
    return;
  });

  // listen for event to create comments with post.
  app.post('/event', (req: Request, res: Response, next: NextFunction) => {
    const { type, data } = req.body;
    if (!type || !data) return res.status(200).json({});
    handleEvent(req.body);
    res.status(200).json({});
  });

  app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    try {
      const res = await axios.get<{ data: AllEventTypes[] }>(
        'http://localhost:4005/events'
      );

      for (const event of res.data.data) {
        console.log('Processing Event:', event.type);
        handleEvent(event);
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      } else {
        console.log(String(e));
      }
    }
  });
})();
