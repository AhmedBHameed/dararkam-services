import {get} from 'lodash';

export default {
  root: get(process.env, 'ROOT', ''),
  database: {
    dbName: get(process.env, 'MONGODB_DB'),
    password: get(process.env, 'MONGODB_PASS'),
    port: get(process.env, 'MONGODB_PORT'),
    server: get(process.env, 'MONGODB_SERVER'),
    user: get(process.env, 'MONGODB_USER'),
  },
  logs: {
    dir: get(process.env, 'LOG_DIR', 'logs'),
    level: get(process.env, 'LOG_LEVEL', 'silly'),
  },
  buildEnv: get(process.env, 'BUILD_ENV', 'dev'),
  port: parseInt(process.env.PORT || '9009'),
};
