import express, { Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import fs from 'fs';
import { randomBytes } from 'crypto';

(async function () {
  const app: Express = express();
  const port = process.env.PORT;

  const posts: { [key: string]: any } = JSON.parse(
    fs.readFileSync('./post.json', 'utf-8')
  );
  app.use(express.json());
  app.get('/post', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(posts);
  });

  app.post('/post', (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;
    const id = randomBytes(4).toString('hex');
    if (!title) return res.status(400).json({ status: 'fail' });

    posts[id] = { id, title };
    fs.writeFileSync('./post.json', JSON.stringify(posts));
    res.status(201).json({ status: 'success', post: posts[id] });
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
})();
