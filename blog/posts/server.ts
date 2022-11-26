import express, { Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import fs from 'fs';
import { randomBytes } from 'crypto';
import cors from 'cors';

(async function () {
  const app: Express = express();
  const port = process.env.PORT;

  const posts: { [key: string]: any } = JSON.parse(
    fs.readFileSync('./post.json', 'utf-8')
  );

  // middleware
  app.use(express.json());
  app.use(cors());

  app.get('/posts', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(posts);
  });

  app.post('/posts', (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;
    console.log('req.body', req.body);
    console.log('title', title);
    const id = randomBytes(4).toString('hex');
    if (!title)
      return res
        .status(400)
        .json({ status: 'fail', msg: 'Post needs a title.', data: title });

    posts[id] = { id, title };
    fs.writeFileSync('./post.json', JSON.stringify(posts));
    res.status(201).json({ status: 'success', data: posts[id] });
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
})();
