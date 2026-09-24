const app = require('../server/src/app');
const connectDB = require('../server/src/config/db');
const ensureAdminAccount = require('../server/src/config/admin');
const ensureBossCatalog = require('../server/src/config/bosses');

let initialized = false;

const initialize = async () => {
  if (initialized) return;
  await connectDB();
  await ensureAdminAccount();
  await ensureBossCatalog();
  initialized = true;
};

module.exports = async function handler(req, res) {
  await initialize();
  return app(req, res);
};
