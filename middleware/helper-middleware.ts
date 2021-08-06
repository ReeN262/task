import {validationResult, ValidationError} from 'express-validator';
import {NextFunction, Request, Response} from 'express';


export function validator(req: Request, res: Response, next: NextFunction) {
  const errorFormatter = ({msg, param}: ValidationError) => {
    return {field: param, errorMessage: msg};
  };
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    res.status(400).json({errors: errors.array()});
    return false;
  } else {
    next();
    return true;
  }
}


