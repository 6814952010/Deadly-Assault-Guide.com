const crypto = require('crypto');
const path = require('path');
const express = require('express');
const { issueSignedToken, presignUrl, parseStoreIdFromDelegationToken } = require('@vercel/blob');
const { requireAdmin } = require('../middlewares/auth.middleware');
const { uploadRules, isBlobConfigured } = require('../config/uploads');

const router = express.Router();
const SIGNED_URL_TTL_MS = 10 * 60 * 1000;

// Step 1 of an upload: the browser asks for permission, then PUTs the file
// directly to Vercel Blob. The file never passes through this function, so the
// 4.5 MB Vercel request limit does not apply.
router.post('/sign', requireAdmin, async (req, res, next) => {
  try {
    const { folder, contentType, size, fileName } = req.body || {};
    const rule = uploadRules[folder];
    if (!rule) return res.status(400).json({ message: 'Unknown upload folder.' });
    if (!isBlobConfigured()) {
      return res.status(503).json({ message: 'File storage is not configured. Connect a Vercel Blob store to the project and redeploy.' });
    }
    if (!rule.types.includes(contentType)) {
      return res.status(400).json({ message: `File type not allowed. Use: ${rule.types.join(', ')}` });
    }
    if (!Number.isFinite(size) || size <= 0 || size > rule.maxSize) {
      return res.status(400).json({ message: `File must be smaller than ${Math.round(rule.maxSize / 1024 / 1024)} MB.` });
    }

    const extension = path.extname(String(fileName || '')).toLowerCase().replace(/[^.a-z0-9]/g, '').slice(0, 10);
    const pathname = `${folder}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`;
    const validUntil = Date.now() + SIGNED_URL_TTL_MS;
    const limits = { allowedContentTypes: [contentType], maximumSizeInBytes: rule.maxSize };

    const signedToken = await issueSignedToken({ pathname, operations: ['put'], validUntil, ...limits });
    const { presignedUrl } = await presignUrl(signedToken, {
      operation: 'put',
      pathname,
      access: 'public',
      validUntil,
      addRandomSuffix: false,
      ...limits
    });

    res.json({
      pathname,
      uploadUrl: presignedUrl,
      headers: {
        'x-api-version': '12',
        'x-vercel-blob-access': 'public',
        'x-vercel-blob-store-id': parseStoreIdFromDelegationToken(signedToken.delegationToken),
        'x-content-type': contentType
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
