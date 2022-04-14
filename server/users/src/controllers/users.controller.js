import User from '../models/user';

// todo: use error handler middleware in this controller too

export default {
  // protected
  deleteUser: async (req, res) => {
    const { id } = req.body;

    try {
      const result = await User.deleteOne({ _id: id });
      if (result.deletedCount !== 0) {
        res.send();
      } else {
        res.status(404).send({});
      }
    } catch (err) {
      res.status(500).send({});
    }
  },

  getUser: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({});
      }
    } catch (err) {
      res.status(500).send({});
    }
  },
};
