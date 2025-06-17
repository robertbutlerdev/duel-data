import cookieParser from 'cookie-parser';
import express from 'express';
import correlator from 'express-correlation-id';
import helmet from 'helmet';
import morgan from 'morgan';
import * as swaggerUI from 'swagger-ui-express';

import * as swaggerJson from '../swagger.generated/swagger.json';

export interface IExpressSetup {
  pre?: (app: express.Express) => void;
  post: (app: express.Express) => void;
}

export function createExpressApp(setup: IExpressSetup): express.Express {
  const app = express();

  if (setup.pre) {
    setup.pre(app);
  }

  app.set('etag', false);
  app.disable('x-powered-by');

  // Parse body as JSON by default
  app.use(express.json());

  // Set response headers for best practice
  app.use(helmet());

  // Cookies
  app.use(cookieParser());

  // Request logger
  app.use(morgan('short'));

  // Produce a correlation ID for each request to help track requests through the system
  app.use(correlator());

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));

  setup.post(app);

  return app;
}
