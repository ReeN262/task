// @ts-ignore
import ping from 'ping';
// @ts-ignore
import bcrypt from 'bcrypt';
import {error} from './error_handler';
import {UserModel} from '../models/users-models';
import TokenService from '../services/token-service';

export default class UsersService {
  public static async sigunp(req: any, res: any) {
    const password = req.body.password;
    const email = req.body.email ? req.body.email : null;
    const phone = req.body.phone ? req.body.phone : null;
    const salt = bcrypt.genSaltSync(10);
    const newUser: any = {
      'email': email,
      'phone': phone,
      'password': bcrypt.hashSync(password, salt),
      'id_type': null,
    };

    if (email !== null) {
      newUser.id_type = 'email';
    } else {
      newUser.id_type = 'phone';
    }

    const searchDub = await UserModel.findOne({email: email, phone: phone});

    if (searchDub) {
      return error(res, 'email or phone alredy in use');
    }

    const user = new UserModel(newUser);
    user.save();

    const tokens = TokenService.generateTokens({id: user._id});
    await TokenService.saveToken(user._id, tokens.refreshToken);
    await TokenService.saveAccessToken(user._id, tokens.accessToken);

    return tokens;
  }

  public static async signin(req: any, res: any) {
    const filter: any = {};

    if (req.body.phone) {
      filter.phone = req.body.phone;
    } else if (req.body.email) {
      filter.email = req.body.email;
    } else {
      return error(res, 'Invalid id');
    }

    const findUser = await UserModel.findOne(filter);

    if (!findUser) {
      return error(res, 'Wrong email or phone number');
    }

    if (!bcrypt.compareSync(req.body.password, findUser!.password!)) {
      return error(res, 'Wrong password');
    }

    const tokens = TokenService.generateTokens({id: findUser._id});
    await TokenService.saveToken(findUser._id, tokens.refreshToken);
    await TokenService.saveAccessToken(findUser._id, tokens.accessToken);

    return tokens;
  }

  public static async latency() {
    const host = 'google.com';
    return await ping.promise.probe(host)
      .then(function(res:any) {
        return res.time;
      });
  }

  public static async logout(all: any, accessToken:any, refreshToken: any) {
    interface user {
      id: string,
    }
    const userData = TokenService.validateAccessToken(accessToken) as user;

    if (all) {
      await TokenService.removeAllAccessToken(userData.id);
    } else {
      await TokenService.removeAccessToken(accessToken);
    }

    await TokenService.removeRefreshToken(refreshToken);
  }
}
