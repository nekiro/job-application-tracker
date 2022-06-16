import { excludeKeys, formatSuccess } from '../util';
import { userExcludedKeys } from '../schemas/auth';
import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const userData = await authService.signIn(email, password);

    res.json(userData);
  } catch (err) {
    next(err);
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.signUp(req.body);

    res.status(201).json(excludeKeys(user, userExcludedKeys));
  } catch (err) {
    next(err);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    await authService.signOut(user.id);

    res.status(204).json(formatSuccess('Logged out succesfully'));
  } catch (err) {
    next(err);
  }
};
