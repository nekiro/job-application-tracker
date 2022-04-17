import Jwt, { JsonWebTokenError } from 'jsonwebtoken';
import User from '../models/user';

export const authenticateToken = async (req, _res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new JsonWebTokenError('Token is required');
    }

    const decodedPayload = Jwt.decode(token);

    const user = await User.findById(decodedPayload.data.id);
    if (!user) {
      throw new JsonWebTokenError('Malformed token data');
    }

    Jwt.verify(token, process.env.TOKEN_SECRET + user.tokenSecret);

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticateToken;
