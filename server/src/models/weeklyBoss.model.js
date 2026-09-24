const mongoose = require('mongoose');

const weeklyBossSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'current' },
  bossSlugs: {
    type: [String], default: [],
    validate: { validator: slugs => slugs.length === 0 || (slugs.length === 3 && new Set(slugs).size === 3), message: 'Weekly bosses must contain exactly three different bosses.' }
  },
  resetsAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('WeeklyBoss', weeklyBossSchema);
