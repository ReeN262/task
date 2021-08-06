import {Response} from 'express';

export function result(res: Response, object: any = {}) {
  object.result = true;
  res.status(200).json(object);
}
