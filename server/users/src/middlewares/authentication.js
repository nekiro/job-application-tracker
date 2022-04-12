import Jwt, {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken';
import User from '../models/user';
import formatError from '../utils/error';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send(formatError('Missing token', 401));
  }

  try {
    const decodedPayload = Jwt.decode(token);

    const user = await User.findById(decodedPayload.data.id);
    if (!user) {
      throw new Error();
    }

    Jwt.verify(token, process.env.TOKEN_SECRET + user.tokenSecret);

    req.user = user;
  } catch (err) {
    console.log(err);
    let formattedError;
    if (err instanceof TokenExpiredError) {
      formattedError = formatError(`Token expired at ${err.expiredAt}`, 401);
    } else if (err instanceof JsonWebTokenError) {
      formattedError = formatError(`Token malformed`, 401);
    } else if (err instanceof NotBeforeError) {
      formattedError = formatError(`Token activates at ${err.date}`, 401);
    }

    if (formattedError) {
      return res.status(401).send(formattedError);
    } else {
      return res.status(500).send();
    }
  }

  next();
};

export default authenticateToken;
