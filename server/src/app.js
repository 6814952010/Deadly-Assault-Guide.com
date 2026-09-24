const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const trackRoutes = require("./routes/track.routes");
const authRoutes = require('./routes/auth.routes');
const bossRoutes = require('./routes/boss.routes');
const deadlyAssaultRoutes = require('./routes/deadlyAssault.routes');
const weeklyBossRoutes = require('./routes/weeklyBoss.routes');
const uploadRoutes = require('./routes/upload.routes');
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const app = express();

// simple request logging for debugging
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
	next();
});
// 1. Global middleware
app.use(cors());
app.use(express.json());
// 2. Routes
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
// return basic mongoose connection state
app.get('/api/dbstatus', (req, res) => {
	const state = mongoose.connection && mongoose.connection.readyState;
	// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
	res.json({ connected: state === 1, state });
});
app.use("/api/tracks", trackRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bosses', bossRoutes);
app.use('/api/deadly-assault', deadlyAssaultRoutes);
app.use('/api/weekly-bosses', weeklyBossRoutes);
app.use('/api/uploads', uploadRoutes);
// 3. Error handling — must be LAST
app.use(notFound);
app.use(errorHandler);
module.exports = app;
