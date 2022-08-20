import { User } from '@prisma/client';
import Jwt from 'jsonwebtoken';
import Role from '../models/role';

//todo: use issuer and audience in token verification

export type Token = { value: string; expiresAt: number };

export type TokenData = {
  accessToken: Token;
  refreshToken: Token;
};

const generateAccessToken = (user: User): Promise<Token> =>
  new Promise((resolve, reject) => {
    try {
      const accessTokenLifeTime = Number(process.env.ACCESS_TOKEN_LIFETIME);
      const accessTokenExpiry =
        Math.floor(Date.now() / 1000) + accessTokenLifeTime;

      const accessToken = Jwt.sign(
        {
          data: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          exp: accessTokenExpiry,
        },
        process.env.ACCESS_TOKEN_SECRET as string
      );

      resolve({ value: accessToken, expiresAt: accessTokenExpiry });
    } catch (err) {
      reject(err);
    }
  });

const generateRefreshToken = (user: User): Promise<Token> =>
  new Promise((resolve, reject) => {
    try {
      const refreshTokenLifeTime = Number(process.env.REFRESH_TOKEN_LIFETIME);
      const refreshTokenExpiry =
        Math.floor(Date.now() / 1000) + refreshTokenLifeTime;

      const refreshToken = Jwt.sign(
        {
          id: user.id,
          exp: refreshTokenExpiry,
        },
        process.env.REFRESH_TOKEN_SECRET as string
      );

      resolve({ value: refreshToken, expiresAt: refreshTokenExpiry });
    } catch (err) {
      reject(err);
    }
  });

export const generateTokenPair = async (
  user: User
): Promise<TokenData | null> => {
  if (!user || !user.id || !user.email || !user.role) {
    return null;
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);
  return {
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (token: string): Promise<Token> =>
  new Promise(async (resolve, reject) => {
    try {
      const user = Jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as User;

      resolve(await generateAccessToken(user));
    } catch (err) {
      reject(err);
    }
  });

export const canAccessResource = (user: User, requestedUserId: string) => {
  if (process.env.SKIP_AUTH === 'true') {
    return true;
  }

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
