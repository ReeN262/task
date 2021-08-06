import {NextFunction, Response, Request} from 'express';
import tokenService from '../services/token-service';
import {error} from '../services/error_handler';
import {UserModel} from '../models/users-models';

export default async function(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return error(res, 'User unauthorized');
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return error(res, 'User unauthorized');
    }

    interface user {
      id: string,
    }

    const userId = tokenService.validateAccessToken(accessToken) as user;

    if (!userId) {
      return error(res, 'User unauthorized');
    }

    const userData = await UserModel.findById(userId.id);

    req.user = {
      id: userData!._id,
      email: userData!.email,
      phone: userData!.phone,
      id_type: userData!.id_type,
    };
    next();
  } catch (e) {
    return error(res, 'User unauthorized');
  }
};
