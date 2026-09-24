const { head, del } = require('@vercel/blob');
const { uploadRules, isBlobUrl } = require('../config/uploads');

// Step 2 of an upload: the form sends `<pathField>` (the Blob pathname issued by
// /api/uploads/sign). Check what the store actually holds, not what the form
// claims, then replace it with the public URL in `<urlField>`.
const verifyBlobUpload = ({ pathField, urlField, folder }) => async (req, res, next) => {
  const pathname = req.body?.[pathField];
  if (pathname === undefined) return next();
  delete req.body[pathField];

  const rule = uploadRules[folder];
  if (typeof pathname !== 'string' || !pathname.startsWith(`${folder}/`) || pathname.includes('..')) {
    return res.status(400).json({ message: 'Invalid upload reference.' });
  }

  try {
    const blob = await head(pathname);
    if (!rule.types.includes(blob.contentType) || blob.size > rule.maxSize) {
      await del(blob.url).catch(() => {});
      return res.status(400).json({ message: 'Uploaded file type or size is not allowed.' });
    }
    req.body[urlField] = blob.url;
    next();
  } catch (error) {
    if (error.name === 'BlobNotFoundError') {
      return res.status(400).json({ message: 'Uploaded file was not found in storage. Please upload it again.' });
    }
    next(error);
  }
};

const removeBlob = async url => {
  if (!url || !isBlobUrl(url)) return;
  try {
    await del(url);
  } catch (error) {
    console.error('Failed to delete old blob:', error.message);
  }
};

module.exports = { verifyBlobUpload, removeBlob };
