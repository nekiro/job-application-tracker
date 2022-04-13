import formatError from '../utils/error';

export const Role = Object.freeze({
  USER: 1,
  ADMIN: 2,
});

export const hasRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(401).send(formatError('Insufficient privileges', 401));
    }

    next();
  };
};
