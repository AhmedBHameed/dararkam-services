import winston from 'winston';
// Winston-transport required for types only.
// eslint-disable-next-line
import Transport from 'winston-transport';

import environment from '../config/environment';

export type Logger = winston.Logger;

const transports: Transport[] = [
  new winston.transports.File({
    level: environment.logs.level,
    filename: `${environment.logs.dir}/app.log`,
    handleExceptions: true,
    maxsize: 1000000, // 1MB
    maxFiles: 5,
  }),
];

if (environment.buildEnv !== 'dev') {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat()),
    })
  );
}

const logger = winston.createLogger({
  level: environment.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({stack: true}),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: transports,
});

export default logger;
