import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken';
import formatError from '../utils/error';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send(formatError('Missing token', 401));
  }

  try {
    req.user = jwt.verify(token, process.env.TOKEN_SECRET);
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

    return res.status(500).send(formatError ?? null);
  }

  return next();
};

export default authenticateToken;
