const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
	try {
		const dnsServers = process.env.MONGO_DNS_SERVERS
			?.split(",")
			.map((server) => server.trim())
			.filter(Boolean);

		if (dnsServers?.length) {
			dns.setServers(dnsServers);
		}

		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};
module.exports = connectDB;