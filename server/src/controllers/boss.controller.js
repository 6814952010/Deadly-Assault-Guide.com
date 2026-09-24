const Boss = require('../models/boss.model');
const { removeBlob } = require('../middlewares/upload.middleware');

const listBosses = async (req, res, next) => {
  try {
    const filter = req.query.includeInactive === 'true' ? {} : { active: true };
    const bosses = await Boss.find(filter).sort({ number: 1 });
    res.json(bosses);
  } catch (error) {
    next(error);
  }
};

const getBoss = async (req, res, next) => {
  try {
    const boss = await Boss.findOne({ slug: req.params.slug });
    if (!boss) return res.status(404).json({ message: 'Boss not found.' });
    res.json(boss);
  } catch (error) {
    next(error);
  }
};

const createBoss = async (req, res, next) => {
  try {
    const boss = await Boss.create(req.body);
    res.status(201).json(boss);
  } catch (error) {
    next(error);
  }
};

const updateBoss = async (req, res, next) => {
  try {
    const previous = await Boss.findOne({ slug: req.params.slug }).select('imageUrl');
    if (!previous) return res.status(404).json({ message: 'Boss not found.' });
    const boss = await Boss.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true
    });
    if (!boss) return res.status(404).json({ message: 'Boss not found.' });
    if (previous.imageUrl && previous.imageUrl !== boss.imageUrl) await removeBlob(previous.imageUrl);
    res.json(boss);
  } catch (error) {
    next(error);
  }
};

module.exports = { listBosses, getBoss, createBoss, updateBoss };
