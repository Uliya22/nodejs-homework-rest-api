const Joi = require('joi');

function postUserValidation(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(30).required(),
    password: Joi.string().min(5).max(10).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

function subscriptionValidation(req, res, next) {
  const schema = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', 'business').required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

module.exports = {
  postUserValidation,
  subscriptionValidation
};
