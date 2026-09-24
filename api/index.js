// Vercel serverless entry: every /api/* request is rewritten here (see vercel.json).
const app = require('../server/src/app');
const connectDB = require('../server/src/config/db');
const ensureAdminAccount = require('../server/src/config/admin');
const ensureBossCatalog = require('../server/src/config/bosses');

let initialization = null;

const initialize = () => {
  if (!initialization) {
    initialization = (async () => {
      await connectDB();
      await ensureAdminAccount();
      await ensureBossCatalog();
    })().catch(error => {
      initialization = null;
      throw error;
    });
  }
  return initialization;
};

module.exports = async function handler(req, res) {
  // Vercel Blob authenticates with OIDC; make sure the SDK can find the token.
  const oidcToken = req.headers['x-vercel-oidc-token'];
  if (oidcToken) process.env.VERCEL_OIDC_TOKEN = oidcToken;

  try {
    await initialize();
  } catch (error) {
    console.error('API startup failed:', error.message);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Database unavailable. Check MONGO_URI and Atlas network access.' }));
    return;
  }
  return app(req, res);
};
