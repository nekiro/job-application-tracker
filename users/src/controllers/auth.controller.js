import User from '../models/user';
import { generateToken } from '../utils/authentication';
import { AuthError } from '../middlewares/errorHandler';

export default {
  // unprotected
  login: async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        email,
      });

      if (!user || !(await user.validatePassword(password))) {
        throw new AuthError("Email or password doesn't match");
      }

      res.send({ ...user.toJSON(), ...generateToken(user) });
    } catch (err) {
      next(err);
    }
  },

  register: async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        throw new AuthError('Email already used');
      }

      user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      res.send(user);
    } catch (err) {
      next(err);
    }
  },

  // protected
  logout: async (req, res) => {
    const { user } = req;

    // revoke token
    user.secretToken = user.generateTokenSecret();
    user.save();
    res.status(200).send({});
  },
};
