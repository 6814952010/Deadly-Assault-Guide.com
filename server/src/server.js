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

if (process.env.VERCEL) {
  initializeServer().catch((error) => {
    console.error('Vercel startup failed:', error.message);
  });
} else if (require.main === module) {
  initializeServer()
    .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
    .catch((error) => {
      console.error('Server startup failed:', error.message);
      process.exit(1);
    });
}

module.exports = app;