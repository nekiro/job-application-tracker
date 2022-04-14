import User from '../models/user';
import { generateToken } from '../utils/authentication';

// todo: use error handler middleware in this controller too

export default {
  // unprotected
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        email,
      });

      if (!user) {
        return res.status(404).send({});
      }

      if (!(await user.validatePassword(password))) {
        return res.status(403).send({});
      }

      res.send(generateToken(user));
    } catch (err) {
      return res.status(500).send({});
    }
  },

  register: async (req, res) => {
    await User.deleteMany();

    const { firstName, lastName, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(409).send({});
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
      console.log(err);
      return res.status(500).send({});
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
