// Every upload goes straight from the browser to Vercel Blob, so the API only
// hands out short-lived signed URLs and verifies what landed in the store.
const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const uploadRules = {
  bosses: { types: imageTypes, maxSize: 10 * 1024 * 1024 }
};

// On Vercel, connecting a Blob store adds BLOB_STORE_ID (OIDC auth).
// Locally, set BLOB_READ_WRITE_TOKEN in server/.env instead.
const isBlobConfigured = () => Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

const isBlobUrl = value => {
  try {
    return new URL(value).hostname.endsWith('.blob.vercel-storage.com');
  } catch {
    return false;
  }
};

module.exports = { uploadRules, isBlobConfigured, isBlobUrl };
