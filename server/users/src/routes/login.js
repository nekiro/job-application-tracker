import express from 'express';
const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).send({ message: 'Not implemented' });
});

export default router;
