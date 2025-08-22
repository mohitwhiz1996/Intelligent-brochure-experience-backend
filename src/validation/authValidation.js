const Joi = require('joi');

const signupSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

module.exports = {
  signupSchema,
  loginSchema
};
