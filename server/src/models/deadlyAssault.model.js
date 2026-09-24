const mongoose = require('mongoose');

const enemySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, lowercase: true },
  rank: { type: String, trim: true },
  weaknesses: { type: [String], default: [] },
  notes: { type: String, trim: true, maxlength: 2000 }
}, { _id: false });

const stageSchema = new mongoose.Schema({
  slot: { type: Number, required: true, min: 1, max: 3 },
  title: { type: String, required: true, trim: true },
  enemies: { type: [enemySchema], default: [] },
  recommendedAgents: { type: [String], default: [] },
  scoreTarget: { type: Number, min: 0 },
  strategy: { type: String, trim: true, maxlength: 4000 }
}, { _id: false });

const deadlyAssaultSchema = new mongoose.Schema({
  cycle: { type: Number, required: true, min: 1, unique: true, index: true },
  patchVersion: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  status: { type: String, enum: ['scheduled', 'active', 'archived'], default: 'scheduled', index: true },
  startsAt: { type: Date, required: true, index: true },
  endsAt: { type: Date, required: true },
  stages: {
    type: [stageSchema],
    validate: {
      validator: stages => stages.length > 0 && new Set(stages.map(stage => stage.slot)).size === stages.length,
      message: 'At least one stage is required and stage slots must be unique.'
    }
  },
  sourceUrl: { type: String, trim: true },
  lastVerifiedAt: Date
}, { timestamps: true });

deadlyAssaultSchema.pre('validate', function validateDates() {
  if (this.startsAt && this.endsAt && this.endsAt <= this.startsAt) {
    this.invalidate('endsAt', 'The end date must be after the start date.');
  }
});

module.exports = mongoose.model('DeadlyAssault', deadlyAssaultSchema);
