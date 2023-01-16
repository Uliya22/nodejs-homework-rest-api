const Joi = require("joi");

function putContactValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(3).max(30).optional(),
    phone: Joi.string()
      .min(7)
      .max(30)
      .pattern(/^\+|\d[0-9()]*\d$/, "numbers")
      .optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
}

module.exports = {
    putContactValidation
};