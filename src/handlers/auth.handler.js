import { generateToken } from '../utils/authentication';
import { AuthError, ResourceExistsError } from '../middlewares/errorHandler';
import { generateSalt, encrypt, compareHash } from '../utils/crypt';
import prisma from '../database';
import { excludeKeys, formatSuccess } from '../utils';
import { userExcludedKeys } from '../schemas/auth';

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.User.findFirst({
      where: { email },
    });

    if (!user) {
      throw new AuthError("Email or password doesn't match");
    }

    if (!(await compareHash(password, user.password))) {
      throw new AuthError("Email or password doesn't match");
    }

    res.send({
      user: excludeKeys(user, userExcludedKeys),
      ...generateToken(user),
    });
  } catch (err) {
    next(err);
  }
};

export const signUp = async (req, res, next) => {
  try {
    //await prisma.User.deleteMany({});

    const { firstName, lastName, email, password, role } = req.body;

    let user;

    try {
      user = await prisma.User.create({
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

    res.send(excludeKeys(user, userExcludedKeys));
  } catch (err) {
    next(err);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const { user } = req;

    // revoke token
    await prisma.User.update({
      where: { id: user.id },
      data: {
        tokenSecret: await generateSalt(6),
      },
    });

    res.status(200).send(formatSuccess('Logged out succesfully'));
  } catch (err) {
    next(err);
  }
};
