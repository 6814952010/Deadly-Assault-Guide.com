const express = require('express');
const controller = require('../controllers/deadlyAssault.controller');
const { requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', controller.listDeadlyAssaults);
router.get('/current', controller.getCurrentDeadlyAssault);
router.get('/:id', controller.getDeadlyAssault);
// Protect these write routes with an admin middleware before production deployment.
router.post('/', requireAdmin, controller.createDeadlyAssault);
router.patch('/:id', requireAdmin, controller.updateDeadlyAssault);

module.exports = router;
