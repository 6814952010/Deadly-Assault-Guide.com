const DeadlyAssault = require('../models/deadlyAssault.model');

const listDeadlyAssaults = async (req, res, next) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const cycles = await DeadlyAssault.find(filter).sort({ startsAt: -1 });
    res.json(cycles);
  } catch (error) {
    next(error);
  }
};

const getCurrentDeadlyAssault = async (req, res, next) => {
  try {
    const now = new Date();
    const cycle = await DeadlyAssault.findOne({
      status: 'active', startsAt: { $lte: now }, endsAt: { $gt: now }
    }).sort({ startsAt: -1 });
    if (!cycle) return res.status(404).json({ message: 'No active Deadly Assault cycle.' });
    res.json(cycle);
  } catch (error) {
    next(error);
  }
};

const getDeadlyAssault = async (req, res, next) => {
  try {
    const cycle = await DeadlyAssault.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'Deadly Assault cycle not found.' });
    res.json(cycle);
  } catch (error) {
    next(error);
  }
};

const createDeadlyAssault = async (req, res, next) => {
  try {
    const cycle = await DeadlyAssault.create(req.body);
    res.status(201).json(cycle);
  } catch (error) {
    next(error);
  }
};

const updateDeadlyAssault = async (req, res, next) => {
  try {
    const cycle = await DeadlyAssault.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!cycle) return res.status(404).json({ message: 'Deadly Assault cycle not found.' });
    res.json(cycle);
  } catch (error) {
    next(error);
  }
};

module.exports = { listDeadlyAssaults, getCurrentDeadlyAssault, getDeadlyAssault, createDeadlyAssault, updateDeadlyAssault };
