import { generateToken } from '../util/authentication';
import AuthError from '../errors/AuthError';
import ResourceExistsError from '../errors/ResourceExistsError';
import { generateSalt, encrypt, compareHash } from '../util/crypt';
import prisma from '../prisma';
import { excludeKeys, formatSuccess } from '../util';
import { userExcludedKeys } from '../schemas/auth';
import { NextFunction, Request, Response } from 'express';

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new AuthError("Email or password doesn't match");
    }

    if (!(await compareHash(password, user.password))) {
      throw new AuthError("Email or password doesn't match");
    }

    res.json({
      user: excludeKeys(user, userExcludedKeys),
      ...generateToken(user),
    });
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
    const { firstName, lastName, email, password, role } = req.body;

    let user;

    try {
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: await encrypt(password),
          role,
          tokenSecret: await generateSalt(6),
        },
      });
    } catch (err) {
      throw new ResourceExistsError('Email already used');
    }

    res.json(excludeKeys(user, userExcludedKeys));
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

    // revoke token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        tokenSecret: await generateSalt(6),
      },
    });

    res.json(formatSuccess('Logged out succesfully'));
  } catch (err) {
    next(err);
  }
};
