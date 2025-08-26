const { uploadFileToSupabase } = require('../services/uploadService');
const { sendSuccess, sendError } = require("../utils/responseHandler");

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Use desired path/key in storage (e.g., folder + original filename)
    const storagePath = `uploads/${req.file.originalname}`;

    // Pass (key, localFilePath, contentType) to service per its signature
    const publicUrl = await uploadFileToSupabase(
      storagePath,
      req.file.path,
      req.file.mimetype
    );

    sendSuccess(res, {publicUrl})
  } catch (error) {
    sendError(res)
  }
}

module.exports = { uploadFile };
