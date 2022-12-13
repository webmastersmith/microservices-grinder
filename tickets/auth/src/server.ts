import express, { Application, NextFunction, Request, Response, Router } from 'express';
import 'express-async-errors';
import 'dotenv/config';
import chalk from 'chalk';
import usersRouter from './routes/users';
import { errorHandler, RouteError, DatabaseError, httpStatusCodes } from './errors';
import mongoose from 'mongoose';
import Log from './library/Logging';
import { config } from './config';
const app: Application = express();
const port = 4000;

/** Connect to Mongo */
mongoose.set('strictQuery', false);
mongoose
  .connect(
    // `mongodb://root:password@mongo-svc:27017`
    `mongodb://${config.mongo.user}:${config.mongo.password}@localhost:27017/AuthDB`,
    { authSource: 'admin', w: 'majority', retryWrites: true }
  )
  .then(() => {
    Log.info('Connected to MongoDB!!!');
    StartServer();
  })
  .catch((e) => {
    throw new DatabaseError(httpStatusCodes.BAD_REQUEST, e);
  });

/** Express Rest API */
async function StartServer() {
  /** Try Catch Route wrapper */
  // HOF wrapper
  const use =
    (fn: any) =>
    (req: Request, res: Response, next: NextFunction): Promise<Router> =>
      Promise.resolve(fn(req, res, next)).catch(next);

  app.use((req, res, next) => {
    // log incoming request.
    Log.info(`Incoming -> Method: [${chalk.yellow(req.method)}] - Url: [${chalk.yellow(req.url)}] - IP: [${chalk.yellow(req.socket.remoteAddress)}]`);

    res.on('finish', () => {
      // log response
      const code = res.statusCode;
      const color = code >= 300 ? chalk.red : chalk.green;
      Log.info(`Outgoing -> Method: [${chalk.yellow(req.method)}] - Url: [${chalk.yellow(req.url)}] - IP: [${chalk.yellow(req.socket.remoteAddress)}] - StatusCode: [${color(res.statusCode)}]`);
    });
    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  /** Rules of API */
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
  });

  /** Routes */
  // all routes use this
  app.use('/api/v1/users', use(usersRouter));

  /** HealthCheck */
  app.get('/ping', (req, res, next) => {
    res.status(200).json({ message: 'pong' });
  });

  app.all('*', async (req: Request, res: Response, next: NextFunction) => {
    throw new RouteError();
  });
  app.use(errorHandler);

  app.listen(port, () => {
    Log.info(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
}
