import { User } from '@prisma/client';
import Jwt from 'jsonwebtoken';
import Role from '../models/role';

//todo: use issuer and audience in token verification

export const generateToken = (user: User) => {
  try {
    if (!user || !user.id || !user.email || !user.role) {
      return null;
    }

    const exp =
      Math.floor(Date.now() / 1000) + Number(process.env.TOKEN_LIFETIME);
    const token = Jwt.sign(
      {
        data: { id: user.id, email: user.email, role: user.role },
        exp,
      },
      process.env.TOKEN_SECRET + user.tokenSecret
    );

    return { token, expiresAt: exp };
  } catch (err) {
    return null;
  }
};

export const canAccessResource = (user: User, requestedUserId: string) => {
  if (!user || !user.id || !user.role) {
    return false;
  }

  // admin bypasses resource checks
  if (user.role === Role.ADMIN) {
    return true;
  }

  if (requestedUserId && user.id !== requestedUserId) {
    return false;
  }

  return true;
};
