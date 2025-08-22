const Joi = require('joi');

const signupSchema = Joi.object({
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(), // Added field
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  mobile: Joi.string().pattern(/^[0-9]+$/).min(10).max(15), // Added field
  countryCode: Joi.string()
    .pattern(/^\+\d{1,4}$/)
    .required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

module.exports = {
  signupSchema,
  loginSchema
};
