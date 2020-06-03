import {Request, Response} from 'express';

export interface IHttpRequestHelper {
  body: any;
  query: any;
  params: any;
  ip: string;
  method: string;
  path: string;
  req: Request;
  res: Response;
}

export type IApiResponse = {
  body: {
    data?: any;
    errors?: [
      {
        code?: string;
        message: string;
      }
    ];
  };
  statusCode: number;
};

const ControllerHandler = (controller: (httpRequestHelper: IHttpRequestHelper) => Promise<IApiResponse>) => {
  return async (req: Request, res: Response) => {
    const httpRequestHelper: IHttpRequestHelper = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      req,
      res,
    };

    try {
      const result = await controller(httpRequestHelper);
      res.send(result.body);
    } catch (error) {
      res.status(error.body.statusCode || 422).send(error.body);
    }
  };
};

export default ControllerHandler;
