import {Response, Request} from 'express';
import {result} from '../services/result';
import {error} from '../services/error_handler';
import UsersService from '../services/user-service';
import TokenService from '../services/token-service';


export default class UsersControllers {
  public static async sigunp(req: Request, res: Response) {
    const userData = await UsersService.sigunp(req, res);

    if (userData) {
      res.cookie('refreshToken', (userData).refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      result(res, {token: `Bearer ${userData.accessToken}`});
    } else {
      error(res, 'Еrror creating user');
    }
  }

  public static async signin(req: Request, res: Response) {
    const userData = await UsersService.signin(req, res);

    if (userData) {
      res.cookie('refreshToken', (userData).refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      result(res, {token: `Bearer ${userData.accessToken}`});
    } else {
      error(res, 'Error signin');
    }
  }

  public static async info(req: Request, res: Response) {
    const tokenData = await TokenService.updateRefreshToken(res, req);

    if (!tokenData) return;

    result(res, {data: req.user, token: `Bearer ${tokenData}`});
  }

  public static async latency(req: Request, res: Response) {
    const tokenData = await TokenService.updateRefreshToken(res, req);
    const latency = await UsersService.latency();

    result(res, {latency: latency, token: `Bearer ${tokenData}`});
  }

  public static async logout(req: Request, res: Response) {
    const accessToken = req.headers.authorization!.split(' ')[1];
    const {refreshToken} = req.cookies;
    await UsersService.logout(req.params.all, accessToken, refreshToken);

    res.clearCookie('refreshToken');
    result(res);
  }
}
