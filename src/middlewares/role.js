import { InvalidRoleError } from './errorHandler';

export const Role = Object.freeze({
  USER: 1,
  ADMIN: 2,
});

export const hasRole = (role) => {
  return (req, _res, next) => {
    if (!req.user || req.user.role !== role) {
      next(new InvalidRoleError('Invalid role'));
    } else {
      next();
    }
  };
};
