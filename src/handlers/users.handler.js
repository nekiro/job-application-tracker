import { NotFoundError } from '../middlewares/errorHandler';
import prisma from '../database';
import { formatSuccess, excludeKeys } from '../utils';
import { userExcludedKeys } from '../schemas/auth';
import { canAccessResource } from '../utils/authentication';
import { AuthError } from '../middlewares/errorHandler';

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      await prisma.User.delete({ where: { id } });
    } catch (err) {
      throw new NotFoundError('User not found');
    }

    res.send(formatSuccess('Deleted succesfully'));
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!canAccessResource(req.user, id)) {
      throw new AuthError();
    }

    const user = await prisma.User.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.send(excludeKeys(user, userExcludedKeys));
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (_req, res, next) => {
  try {
    const users = await prisma.User.findMany();
    res.send(users.map((user) => excludeKeys(user, userExcludedKeys)));
  } catch (err) {
    next(err);
  }
};
