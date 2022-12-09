import express, { Application, Request, Response } from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import usersRouter from './routes/users';
import { errorHandler } from './errors';

const app: Application = express();
const port = 4000;

app.use(express.json());

// only needed for development
app.use(morgan('dev'));

// all routes use this
app.use('/api/v1/users', usersRouter);

app.all('*', (req: Request, res: Response) => {
  res.send('Route Catch all.');
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
