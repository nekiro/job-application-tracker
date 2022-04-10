import Jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  try {
    return Jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '2h',
      }
    );
  } catch (err) {
    console.log(err);
    return null;
  }
};
