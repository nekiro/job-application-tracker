import app from './app';
import serverless from 'serverless-http';
import { createConnection } from './database';

// connect to mongodb
createConnection();

export const handler = serverless(app);
