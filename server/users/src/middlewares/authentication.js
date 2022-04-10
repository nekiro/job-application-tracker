import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send();
  }

  try {
    req.user = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    return res.status(401).send();
  }

  return next();
};

export default authenticateToken;
