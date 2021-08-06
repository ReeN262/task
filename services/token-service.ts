// @ts-ignore
import jwt from 'jsonwebtoken';
import {rTokenModel} from '../models/refreshToken-models';
import {settings} from '../settings/settings';
import {error} from './error_handler';
import {aTokenModel} from '../models/accessToken-models';

export default class TokenService {
  public static generateTokens(payload: any) {
    const accessToken = jwt.sign(payload, settings.JWT_ACCESS_KEY, {expiresIn: '10m'});
    const refreshToken = jwt.sign(payload, settings.JWT_REFRESH_KEY, {expiresIn: '30d'});
    return {
      accessToken,
      refreshToken,
    };
  }

  public static validateAccessToken(token: any) {
    try {
      return jwt.verify(token, settings.JWT_ACCESS_KEY);
    } catch (e) {
      return null;
    }
  }

  public static validateRefreshToken(token: any) {
    try {
      return jwt.verify(token, settings.JWT_REFRESH_KEY);
    } catch (e) {
      return null;
    }
  }

  public static async saveToken(userId: any, refreshToken: any) {
    const tokenData = await rTokenModel.findOne({user: userId});
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await rTokenModel.create({user: userId, refreshToken});
  }

  public static async removeRefreshToken(refreshToken: any) {
    return await rTokenModel.deleteOne({refreshToken});
  }

  public static async findToken(refreshToken: any) {
    return await rTokenModel.findOne({refreshToken});
  }

  public static async saveAccessToken(userId: string, accessToken: any) {
    return await aTokenModel.create({user: userId, accessToken: accessToken});
  }

  public static async removeAccessToken(accessToken: any) {
    return await aTokenModel.deleteOne({accessToken});
  }

  public static async removeAllAccessToken(userId: any) {
    return await aTokenModel.deleteMany({user: userId});
  }

  public static async updateRefreshToken(res: any, req: any) {
    {
      const {refreshToken} = req.cookies || null;
      const accessToken = req.headers.authorization!.split(' ')[1];


      if (!refreshToken) {
        return error(res, 'User unauthorized');
      }

      interface user {
        id: string,
      }

      const userData = this.validateRefreshToken(refreshToken) as user;
      await this.saveAccessToken(userData.id, accessToken);
      const tokenFromDb = await this.findToken(refreshToken);


      if (!userData || !tokenFromDb) {
        return error(res, 'User unauthorized');
      }
      const tokens = this.generateTokens({id: userData.id});

      await this.saveToken(userData.id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return tokens.accessToken;
    }
  }
}

