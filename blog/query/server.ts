import express, { Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import fs from 'fs';
// import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

(async function () {
  const app: Express = express();
  const port = process.env.PORT;

  const queries: { [key: string]: any } = JSON.parse(
    fs.readFileSync('./queries.json', 'utf-8')
  );

  // middleware
  app.use(express.json());
  app.use(cors());

  app.get('/query/:type', (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params;
    // if (!type) return res.status(400)
    if (type === 'Posts') {
      return res.status(200).json(queries.posts);
    }
    if (type === 'Comments') {
      return res.status(200).json(queries.comments);
    }
    return res.status(200).json([]);
  });

  app.post('/event', (req: Request, res: Response, next: NextFunction) => {
    const event = req.body;
    console.log('Query Event', event);
    if (!event) return res.status(200);

    if (event.type === 'PostCreated') {
      queries.posts.push(event.data);
      res.status(201).json({});
      fs.writeFileSync('./queries.json', JSON.stringify(queries));
      return;
    }
    if (event.type === 'CommentCreated') {
      queries.comments[event.data.postId]
        ? queries.comments[event.data.postId].push(event.data)
        : (queries.comments[event.data.postId] = [event.data]);
      res.status(201).json({});
      fs.writeFileSync('./queries.json', JSON.stringify(queries));
      return;
    }

    res.status(200);
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
})();
