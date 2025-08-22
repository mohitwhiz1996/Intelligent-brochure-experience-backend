const User = require('../models/user');
const { sendSuccess, sendError } = require('../utils/responseHandler');

async function getProfile(req, res) {
  try {
    // req.userId is set by authenticateToken middleware
    const user = await User.findById(req.userId).select('-passwordHash'); // exclude passwordHash

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, { user });
  } catch (err) {
    console.error(err);
    sendError(res);
  }
}

module.exports = {
  getProfile,
};
