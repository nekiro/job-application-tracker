import User from '../models/user';
import { generateToken } from '../utils/authentication';

const refreshToken = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(404).send();
  }

  if (!(await user.validatePassword(password))) {
    return res.status(403).send();
  }

  res.send(generateToken(user));
};

const createUser = async (req, res) => {
  await User.deleteMany();

  const { firstName, lastName, email, password, role } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.status(409).send();
  }

  // create
  user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  res.send(user);
};

const deleteUser = async (req, res) => {
  const { id } = req.body;

  const result = await User.deleteOne({ _id: id });
  if (result.deletedCount !== 0) {
    res.send();
  } else {
    res.status(404).send();
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send();
  }
};

export default {
  refreshToken,
  createUser,
  deleteUser,
  getUser,
};
