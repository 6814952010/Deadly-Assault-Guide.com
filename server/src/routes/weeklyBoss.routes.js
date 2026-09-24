const express = require('express');
const controller = require('../controllers/weeklyBoss.controller');
const { requireAdmin } = require('../middlewares/auth.middleware');
const router = express.Router();
router.get('/current', controller.getCurrentWeeklyBosses);
router.put('/current', requireAdmin, controller.setWeeklyBosses);
module.exports = router;
