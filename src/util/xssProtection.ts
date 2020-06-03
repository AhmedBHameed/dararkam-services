import {NextFunction, Request, RequestHandler, Response} from 'express'; // as types for typescript only

// interface XssProtection {
//   [key: string]: string | number | undefined | null;
// }

const xssClean = (sanitizer: any, data: any = '') => {
  let isObject = false;
  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }
  sanitizer.sanitize(data);
  if (isObject) data = JSON.parse(data);
  return data;
};

// eslint-disable-next-line
export const xssProtection = (sanitizer: any): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.body) req.body = xssClean(sanitizer, req.body);
  if (req.query) req.query = xssClean(sanitizer, req.query);
  if (req.params) req.params = xssClean(sanitizer, req.params);
  next();
};
