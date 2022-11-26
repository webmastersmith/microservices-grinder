import express, { Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import fs from 'fs';
import crypto from 'crypto';

(async function () {
  const app: Express = express();
  const port = process.env.PORT;

  const posts: { [key: string]: any } = JSON.parse(
    fs.readFileSync('./post.json', 'utf-8')
  );
  app.use(express.json());
  app.get('/post', (req: Request, res: Response, next: NextFunction) => {
    res.send(posts);
  });

  app.post('/post', (req: Request, res: Response, next: NextFunction) => {
    const { post } = req.body;
    if (!post) return next();
    posts[`${crypto.randomUUID}`] = post;
    fs.writeFileSync('./post.json', JSON.stringify(posts));
    res.send('ok');
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
})();
