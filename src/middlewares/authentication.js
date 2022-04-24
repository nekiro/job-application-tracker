import Jwt, { JsonWebTokenError } from 'jsonwebtoken';
import User from '../models/user';
import { AuthError } from './errorHandler';
import { Role } from './role';

// options = {
//   sameUser: boolean,
//   sameUserOrAdmin: boolean
// }

const checkOptions = (req, res, options) => {
  const { sameUserOrAdmin, sameUser } = options;

  if (
    (sameUserOrAdmin &&
      req.params[sameUserOrAdmin] !== req.user.id &&
      req.user.role !== Role.ADMIN) ||
    (sameUser && req.params[sameUserOrAdmin] === req.user.id)
  ) {
    throw new AuthError('Unauthorized');
  }
};

export const authenticate =
  (options = {}) =>
  async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        throw new JsonWebTokenError('Token is required');
      }

      const decodedPayload = Jwt.decode(token);
      if (!decodedPayload) {
        throw new JsonWebTokenError('Malformed token data');
      }

      const user = await User.findById(decodedPayload.data.id);
      if (!user) {
        throw new JsonWebTokenError('Malformed token data');
      }

      Jwt.verify(token, process.env.TOKEN_SECRET + user.tokenSecret);

      req.user = user;

      // throws exception, so we dont need to check anything here
      checkOptions(req, res, options);

      next();
    } catch (err) {
      next(err);
    }
  };
