// Send success response with consistent format
function sendSuccess(res, data = {}, status = 200) {
  res.status(status).json({
    status: 'success',
    data
  });
}

// Send error response with consistent format
function sendError(res, message = 'Something went wrong', status = 500) {
  res.status(status).json({
    status: 'error',
    message
  });
}

module.exports = {
  sendSuccess,
  sendError
};
