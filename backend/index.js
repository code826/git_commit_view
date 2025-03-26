import { startServer } from './src/server.js';

import 'dotenv/config';

console.log('env',process.env.ENVIROMENT);

startServer();