import express, { Application, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import 'dotenv/config';
import morgan from 'morgan';
import usersRouter from './routes/users';
import { errorHandler, RouteError, DatabaseError } from './errors';
import mongoose from 'mongoose';

const app: Application = express();
const port = 4000;

app.use(express.json());

// only needed for development
app.use(morgan('dev'));

// all routes use this
app.use('/api/v1/users', usersRouter);

app.all('*', async (req: Request, res: Response, next: NextFunction) => {
  throw new RouteError();
});
app.use(errorHandler);

async function start() {
  try {
    mongoose.set('strictQuery', false);
    const db = await mongoose.connect(
      `mongodb://root:password@mongo-svc:27017`
    );
    console.log('Connected to MongoDB!!!');
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      throw new DatabaseError(e);
    } else {
      console.log(String(e));
      throw new Error();
    }
  } finally {
    // db.disconnect(); // for http servers stays running to validate api request.
    // console.log('Closed Client');
  }
}

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

start();
