import prisma from '../prisma';
import { formatSuccess, excludeKeys } from '../util';
import { userExcludedKeys } from '../schemas/auth';
import { canAccessResource } from '../util/authentication';
import AuthError from '../errors/AuthError';
import NotFoundError from '../errors/NotFoundError';
import { NextFunction, Request, Response } from 'express';

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    try {
      await prisma.user.delete({ where: { id } });
    } catch (err) {
      throw new NotFoundError('User not found');
    }

    res.send(formatSuccess('Deleted succesfully'));
  } catch (err) {
    next(err);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!canAccessResource(req.user, id)) {
      throw new AuthError();
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.send(excludeKeys(user, userExcludedKeys));
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany();
    res.send(users.map((user) => excludeKeys(user, userExcludedKeys)));
  } catch (err) {
    next(err);
  }
};
