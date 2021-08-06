import {Response} from 'express';

export function error(res: Response, message: string) {
  res.status(400).json({
    result: false,
    message: message,
  });
}
