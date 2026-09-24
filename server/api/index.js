const app = require('../src/app');
const connectDB = require('../src/config/db');
const ensureAdminAccount = require('../src/config/admin');
const ensureBossCatalog = require('../src/config/bosses');

let initialized = false;

const initializeServer = async () => {
  if (initialized) return;
  await connectDB();
  await ensureAdminAccount();
  await ensureBossCatalog();
  initialized = true;
};

module.exports = async function handler(req, res) {
  await initializeServer();
  return app(req, res);
};
