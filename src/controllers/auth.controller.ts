import { dev, excludeKeys, formatSuccess } from '../util';
import { userExcludedKeys } from '../schemas/auth';
import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';
import AuthError from '../errors/AuthError';
import { refreshToken as authRefreshToken } from '../util/authentication';

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const tokenData = await authService.signIn(email, password);
    if (!tokenData) {
      throw new AuthError();
    }

    res.cookie('jwt', tokenData.refreshToken.value, {
      httpOnly: true,
      sameSite: 'none',
      secure: !dev,
      maxAge: Number(process.env.REFRESH_TOKEN_LIFETIME) * 1000,
    });

    res.json({ token: tokenData.accessToken.value });
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

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies?.jwt) {
      throw new AuthError();
    }

    const token = await authRefreshToken(req.cookies.jwt);
    res.status(200).json({ token: token.value });
  } catch (err) {
    next(err);
  }
};
