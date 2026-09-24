const mongoose = require('mongoose');

const bossSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  number: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true, default: '' },
  imageKey: { type: String, trim: true },
  intro: { type: String, required: true, trim: true, maxlength: 2000 },
  threatProfile: { type: String, trim: true, maxlength: 4000 },
  fightPlan: { type: String, trim: true, maxlength: 4000 },
  squadNote: { type: String, trim: true, maxlength: 4000 },
  weaknesses: { type: [String], default: ['placeholder for user input'] },
  resistances: { type: [String], default: ['placeholder for user input'] },
  recommendedSpecialties: { type: [String], default: ['placeholder for user input'] },
  mechanics: { type: String, trim: true, default: 'placeholder for user input', maxlength: 8000 },
  recommendedAgents: { type: [String], default: [] },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Boss', bossSchema);
