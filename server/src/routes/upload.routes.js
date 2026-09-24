const express = require('express');
const multer = require('multer');
const { put } = require('@vercel/blob');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
    });

    return res.status(201).json({
      url: blob.url,
      pathname: blob.pathname,
      size: req.file.size,
      contentType: req.file.mimetype,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
