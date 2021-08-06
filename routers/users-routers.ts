import {Router} from 'express';
import auth from '../middleware/passport-middleware';
import {body} from 'express-validator';

import {validator} from '../middleware/helper-middleware';
import UsersControllers from '../controllers/users-controllers';

// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.post(
  '/sigunp',
  body('phone', 'invalid phone number').isMobilePhone('uk-UA').optional(),
  body('email', 'Invalid email').isEmail().optional(),
  body('password', 'Minimal length 7').isLength({min: 7}),
  validator,
  UsersControllers.sigunp,
);

usersRouter.post(
  '/signin',
  body('phone', 'invalid phone number').isMobilePhone('uk-UA').optional(),
  body('email', 'Invalid email').isEmail().optional(),
  body('password', 'Minimal length 7').isLength({min: 7}),
  validator,
  UsersControllers.signin,
);

usersRouter.get(
  '/info',
  auth,
  UsersControllers.info,
);

usersRouter.get(
  '/latency',
  auth,
  UsersControllers.latency,
);

usersRouter.get(
  '/logout/:all',
  auth,
  UsersControllers.logout,
);

export default usersRouter;
