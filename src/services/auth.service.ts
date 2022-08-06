import { User } from '@prisma/client';
import AuthError from '../errors/AuthError';
import ResourceExistsError from '../errors/ResourceExistsError';
import prisma from '../prisma';
import { userExcludedKeys } from '../schemas/auth';
import UserDTO from '../types/UserDTO';
import { excludeKeys } from '../util';
import { generateToken } from '../util/authentication';
import { compareHash, encrypt, generateSalt } from '../util/crypt';
import { createUser } from './user.service';

export const signIn = async (email: string, password: string): Promise<any> => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new AuthError("Email or password doesn't match");
  }

  if (!(await compareHash(password, user.password))) {
    throw new AuthError("Email or password doesn't match");
  }

  return {
    user: excludeKeys(user, userExcludedKeys),
    ...generateToken(user),
  };
};

export const signUp = async (userData: UserDTO): Promise<User> => {
  try {
    const { firstName, lastName, email, password, role } = userData;

    const user = await createUser({
      firstName,
      lastName,
      email,
      password: await encrypt(password),
      role,
      tokenSecret: await generateSalt(6),
    });

    return user;
  } catch (err) {
    throw new ResourceExistsError('Email already used');
  }
};

export const signOut = async (userId: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      tokenSecret: await generateSalt(6),
    },
  });
};
