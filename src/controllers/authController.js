const { sendSuccess, sendError } = require('../utils/responseHandler');
const { signupSchema, loginSchema } = require('../validation/authValidation');
const { signupUser, loginUser } = require('../services/authService');

async function signup(req, res) {
  const { error } = signupSchema.validate(req.body);
  if (error) return sendError(res, error.details[0].message, 400);

  try {
    const newUser = await signupUser(req.body);
    sendSuccess(res, { userId: newUser._id }, 201);
  } catch (err) {
    if (err.message === 'User already exists') {
      return sendError(res, err.message, 400);
    }
    console.error(err);
    sendError(res);
  }
}

async function login(req, res) {
  const { error } = loginSchema.validate(req.body);
  if (error) return sendError(res, error.details[0].message, 400);

  try {
    const token = await loginUser(req.body);
    sendSuccess(res, { token });
  } catch (err) {
    if (err.message === 'Invalid email or password') {
      return sendError(res, err.message, 400);
    }
    console.error(err);
    sendError(res);
  }
}

module.exports = {
  signup,
  login,
  // other exports ...
};
