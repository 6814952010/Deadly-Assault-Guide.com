const mongoose = require("mongoose");
const dns = require("dns");

// Cache the connection promise so concurrent cold-start requests on Vercel
// share one handshake. Reset it on failure so the next request can retry.
let connection = null;

const connectDB = async () => {
	if (mongoose.connection.readyState === 1) return mongoose.connection;
	if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not set");

	if (!connection) {
		const dnsServers = process.env.MONGO_DNS_SERVERS
			?.split(",")
			.map((server) => server.trim())
			.filter(Boolean);

		if (dnsServers?.length) {
			dns.setServers(dnsServers);
		}

		connection = mongoose
			.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
			.then(() => {
				console.log("MongoDB connected");
				return mongoose.connection;
			})
			.catch((error) => {
				connection = null;
				console.error("MongoDB connection failed:", error.message);
				throw error;
			});
	}
	return connection;
};
module.exports = connectDB;
