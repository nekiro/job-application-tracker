import Jwt from 'jsonwebtoken';
import { AuthError } from '../middlewares/errorHandler';
import { Role } from '../middlewares/role';

//todo: use issuer and audience in token verification

export const generateToken = (user) => {
  try {
    const exp =
      Math.floor(Date.now() / 1000) + Number(process.env.TOKEN_LIFETIME);
    const token = Jwt.sign(
      {
        data: { id: user._id, email: user.email, role: user.role },
        exp,
      },
      process.env.TOKEN_SECRET + user.tokenSecret
    );

    return { token, expiresAt: exp };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const canAccessResource = (user, requestedUserId) => {
  // admin bypasses resource checks
  if (user.role === Role.ADMIN) {
    return true;
  }

  if (requestedUserId && user.id !== requestedUserId) {
    return false;
  }

  return true;
};
