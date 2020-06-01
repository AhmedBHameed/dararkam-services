import {NextFunction, Request, RequestHandler, Response} from 'express';

export const allowOriginAccess = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): undefined | void => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Range,Authorization');
    if (req.method === 'OPTIONS') {
      res.send();
      return;
    }
    next();
  };
};
