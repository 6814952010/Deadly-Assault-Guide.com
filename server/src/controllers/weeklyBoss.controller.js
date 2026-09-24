const Boss = require('../models/boss.model');
const WeeklyBoss = require('../models/weeklyBoss.model');

const emptySelection = { bossSlugs: [], resetsAt: null, bosses: [] };

const getCurrentWeeklyBosses = async (req, res, next) => {
  try {
    const selection = await WeeklyBoss.findOne({ key: 'current' });
    if (!selection || !selection.resetsAt || selection.resetsAt <= new Date()) {
      if (selection?.bossSlugs.length) { selection.bossSlugs = []; selection.resetsAt = null; await selection.save(); }
      return res.json(emptySelection);
    }
    const bosses = await Boss.find({ slug: { $in: selection.bossSlugs } });
    const bySlug = new Map(bosses.map(boss => [boss.slug, boss]));
    res.json({ bossSlugs: selection.bossSlugs, resetsAt: selection.resetsAt, bosses: selection.bossSlugs.map(slug => bySlug.get(slug)).filter(Boolean) });
  } catch (error) { next(error); }
};

const setWeeklyBosses = async (req, res, next) => {
  try {
    const bossSlugs = Array.isArray(req.body.bossSlugs) ? req.body.bossSlugs.map(slug => String(slug).trim().toLowerCase()) : [];
    if (bossSlugs.length !== 3 || new Set(bossSlugs).size !== 3) return res.status(400).json({ message: 'Select exactly three different bosses.' });
    if (await Boss.countDocuments({ slug: { $in: bossSlugs } }) !== 3) return res.status(400).json({ message: 'One or more selected bosses do not exist.' });
    const resetsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await WeeklyBoss.findOneAndUpdate({ key: 'current' }, { key: 'current', bossSlugs, resetsAt }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    const bosses = await Boss.find({ slug: { $in: bossSlugs } });
    const bySlug = new Map(bosses.map(boss => [boss.slug, boss]));
    res.json({ bossSlugs, resetsAt, bosses: bossSlugs.map(slug => bySlug.get(slug)) });
  } catch (error) { next(error); }
};

module.exports = { getCurrentWeeklyBosses, setWeeklyBosses };
