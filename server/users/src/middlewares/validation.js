import getSchema from '../schemas';

const pathToSchema = new Map([
  ['/users/delete', 'deleteSchema'],
  ['/users/create', 'createSchema'],
  ['/users/refreshToken', 'refreshTokenSchema'],
]);

const validateRequest = async (req, res, next) => {
  const name = pathToSchema.get(req.originalUrl);
  if (!name) {
    return next();
  }

  const schema = await getSchema(name);
  if (!schema) {
    return next();
  }

  const { error, value } = schema.validate(
    { body: req.body },
    {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    }
  );

  if (error) {
    res.status(400).send({ error: error.details.map((e) => e.message) });
  } else {
    req.body = value.body;
    req.params = value.params ?? {};
    req.query = value.query ?? {};
    next();
  }
};

export default validateRequest;
