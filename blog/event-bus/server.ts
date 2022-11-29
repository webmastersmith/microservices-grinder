import express, { Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
// import fs from 'fs';
// import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

(async function () {
  const app: Express = express();
  const port = process.env.PORT;

  // const events: { [key: string]: any } = JSON.parse(
  //   fs.readFileSync('./events.json', 'utf-8')
  // );

  // middleware
  app.use(express.json());
  app.use(cors());

  // app.get('/events', (req: Request, res: Response, next: NextFunction) => {
  //   res.status(200).json(events);
  // });

  app.post('/events', (req: Request, res: Response, next: NextFunction) => {
    const event = req.body;
    // const id = randomBytes(4).toString('hex');
    console.log('event', event);
    if (!event)
      return res.status(400).json({ status: 'fail', msg: 'No Event found.' });

    axios.post('http://localhost:4000/event', event).catch((err) => {
      console.log('Event Port 4000', err.message);
    }); // posts
    axios.post('http://localhost:4001/event', event).catch((err) => {
      console.log('Event Port 4001', err.message);
    }); // comments
    axios.post('http://localhost:4002/event', event).catch((err) => {
      console.log('Event Port 4002', err.message);
    }); // query
    axios.post('http://localhost:4003/event', event).catch((err) => {
      console.log('Event Port 4003', err.message);
    }); // query

    // fs.writeFileSync('./post.json', JSON.stringify(events));
    res.status(201).json({ status: 'success', data: event });
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
})();
