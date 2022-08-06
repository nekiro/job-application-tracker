import Jwt, { decode, JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import AuthError from '../errors/AuthError';
// import { Role } from './role';
import prisma from '../prisma';
import { NextFunction, Request, Response } from 'express';

// options = {
//   sameUser: boolean,
//   sameUserOrAdmin: boolean
// }

// const checkOptions = (user: any, options: any) => {
//   // const { sameUserOrAdmin, sameUser, allowedRoles } = options;
//   const { allowedRoles } = options;

//   if (
//     allowedRoles &&
//     allowedRoles.length > 0 &&
//     !allowedRoles.includes(user.role)
//   ) {
//     throw new AuthError('Unauthorized');
//   }

//   // if (
//   //   (sameUserOrAdmin &&
//   //     req.params[sameUserOrAdmin] !== req.user.id &&
//   //     req.user.role !== Role.ADMIN) ||
//   //   (sameUser && req.params[sameUserOrAdmin] === req.user.id)
//   // ) {
//   //   throw new AuthError('Unauthorized');
//   // }
// };

export const authenticate =
  (options = {}) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (process.env.SKIP_AUTH === 'true') {
        const user = await prisma.user.findFirst();
        if (!user) {
          throw new JsonWebTokenError('Malformed token data');
        }
        req.user = user;
        return next();
      }

      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        throw new JsonWebTokenError('Token is required');
      }

      const decodedPayload = Jwt.decode(token) as any;
      if (!decodedPayload) {
        throw new JsonWebTokenError('Malformed token data');
      }

      const user = await prisma.user.findFirst({
        where: { id: decodedPayload.data.id },
      });
      if (!user) {
        throw new JsonWebTokenError('Malformed token data');
      }

      Jwt.verify(token, process.env.TOKEN_SECRET + user.tokenSecret);

      req.user = user;

      // throws exception, so we dont need to check anything here
      //checkOptions(user, options);

      next();
    } catch (err) {
      next(err);
    }
  };
