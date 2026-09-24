require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const ensureAdminAccount = require('./config/admin');
const ensureBossCatalog = require('./config/bosses');
const PORT = process.env.PORT || 5000;

const initializeServer = async () => {
  await connectDB();
  await ensureAdminAccount();
  await ensureBossCatalog();
};

// Local development only. On Vercel the API runs through api/index.js.
if (require.main === module) {
  initializeServer()
    .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
    .catch((error) => {
      console.error('Server startup failed:', error.message);
      process.exit(1);
    });
}

module.exports = app;