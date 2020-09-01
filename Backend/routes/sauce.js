const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrller = require('../controllers/sauce');

router.get('/', auth, sauceCtrller.getSauces);
router.get('/:id', auth, sauceCtrller.getSauce);
router.post('/', auth, multer, sauceCtrller.createSauce);
router.put('/:id', auth, multer, sauceCtrller.updateSauce);
router.delete('/:id', auth, multer, sauceCtrller.deleteSauce);
router.post('/:id/like', auth, sauceCtrller.likeOrDislike);

module.exports = router;