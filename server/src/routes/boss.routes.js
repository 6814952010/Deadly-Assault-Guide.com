const express = require('express');
const controller = require('../controllers/boss.controller');
const { requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', controller.listBosses);
router.get('/:slug', controller.getBoss);
router.post('/', requireAdmin, controller.createBoss);
router.patch('/:slug', requireAdmin, controller.updateBoss);

module.exports = router;
