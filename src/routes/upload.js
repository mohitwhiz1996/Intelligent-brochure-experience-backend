const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadController');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder where files will be saved locally
  },
  filename: function (req, file, cb) {
    // Use original file name:
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
const router = express.Router();

router.post('/', upload.single('file'), uploadFile);

module.exports = router;
