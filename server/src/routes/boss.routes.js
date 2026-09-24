const express = require('express');
const controller = require('../controllers/boss.controller');
const { requireAdmin } = require('../middlewares/auth.middleware');
const { verifyBlobUpload } = require('../middlewares/upload.middleware');

const router = express.Router();
const verifyBossImage = verifyBlobUpload({ pathField: 'imagePath', urlField: 'imageUrl', folder: 'bosses' });

router.get('/', controller.listBosses);
router.get('/:slug', controller.getBoss);
router.post('/', requireAdmin, verifyBossImage, controller.createBoss);
router.patch('/:slug', requireAdmin, verifyBossImage, controller.updateBoss);

module.exports = router;
