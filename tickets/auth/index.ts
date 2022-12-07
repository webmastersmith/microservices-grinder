import express, { Application, Request, Response } from 'express';

const app: Application = express();
const port = 4000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  console.log('home route!');

  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
