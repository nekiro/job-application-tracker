import { excludeKeys } from '../util';
import { userExcludedKeys } from '../schemas/auth';
import { canAccessResource } from '../util/authentication';
import AuthError from '../errors/AuthError';
import { NextFunction, Request, Response } from 'express';
import * as usersService from '../services/user.service';

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await usersService.deleteUser(id);

    res.sendStatus(204);
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
    const { userId } = req.params;

    if (!canAccessResource(req.user, userId)) {
      throw new AuthError();
    }

    const user = await usersService.getUser(userId);
    res.json(excludeKeys(user as any, userExcludedKeys));
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
    const users = await usersService.getUsers();
    res.json(users.map((user) => excludeKeys(user, userExcludedKeys)));
  } catch (err) {
    next(err);
  }
};
