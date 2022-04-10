import Joi from 'joi';

const deleteSchema = Joi.object({
  body: Joi.object({
    id: Joi.string().required(),
  }),
});

export default deleteSchema;
