import express, { Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
// import fs from 'fs';
// import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';
import { AllEventTypes } from './types';

(async function () {
  const app: Express = express();
  const port = process.env.PORT;
  const address =
    process.env.NODE_ENV === 'development' ? 'localhost' : 'events-svc';
  const addr =
    process.env.NODE_ENV === 'development'
      ? ['localhost', 'localhost', 'localhost', 'localhost']
      : ['posts-svc', 'comments-svc', 'query-svc', 'moderation-svc'];

  // const events: { [key: string]: any } = JSON.parse(
  //   fs.readFileSync('./events.json', 'utf-8')
  // );

  // middleware
  app.use(express.json());
  app.use(cors());

  //  app.get('/events', (req: Request, res: Response, next: NextFunction) => {
  //   res.status(200).json(events);
  // });
  const events: AllEventTypes[] = [];

  app.get('/events', (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({ status: 'success', data: events });
  });

  app.post('/events', (req: Request, res: Response, next: NextFunction) => {
    const event = req.body;
    // const id = randomBytes(4).toString('hex');
    if (!event)
      return res.status(400).json({ status: 'fail', msg: 'No Event found.' });
    console.log('event', event);
    events.push(event);

    axios.post(`http://${addr[0]}:4000/event`, event).catch((err) => {
      console.log('Posts Event Err Port 4000', err.message);
    }); // posts
    axios.post(`http://${addr[1]}:4001/event`, event).catch((err) => {
      console.log('Comments Event Err Port 4001', err.message);
    }); // comments
    axios.post(`http://${addr[2]}:4002/event`, event).catch((err) => {
      console.log('Query Event Err Port 4002', err.message);
    }); // query
    axios.post(`http://${addr[3]}:4003/event`, event).catch((err) => {
      console.log('Moderation Event Err Port 4003', err.message);
    }); // query

    // fs.writeFileSync('./post.json', JSON.stringify(events));
    res.status(201).json({ status: 'success', data: event });
  });

  app.listen(port, () => {
    console.log('version 2');
    console.log(`⚡️[server]: Server is running at http://${address}:${port}`);
  });
})();
