import express, { Application, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import axios from 'axios';
import { CommentEventType, CommentType } from './types';

(async function () {
  const app: Application = express();
  const port = process.env.PORT;
  const address =
    process.env.NODE_ENV === 'development' ? 'localhost' : 'events-svc';

  // middleware
  app.use(express.json());

  // listen for event to create comments with post.
  app.post(
    '/event',
    async (req: Request, res: Response, next: NextFunction) => {
      const { type, data }: CommentEventType = req.body;

      if (type === 'CommentCreated') {
        const status = data.comment.includes('orange')
          ? 'rejected'
          : 'approved';
        // console.log('CommentCreated', status);
        // console.log('CommentCreated', { ...data, status });

        await axios
          .post(`http://${address}:4005/events`, {
            type: 'CommentUpdated',
            data: { ...data, status },
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
      res.status(201).json({});
      // fs.writeFileSync('./queries.json', JSON.stringify(posts));
      return;
    }
  );

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://${address}:${port}`);
  });
})();
