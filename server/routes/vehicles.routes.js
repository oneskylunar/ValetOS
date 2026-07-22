const express = require('express');
const { upload } = require('../middleware/upload');
const ctl = require('../controllers/vehicles.controller');

const router = express.Router();
router.get('/', ctl.listVehicles);
router.get('/:id', ctl.getVehicle);
// multer accepts up to 6 images; field name is `images`.
router.post('/checkin', upload.array('images', 6), ctl.checkin);
router.put('/:id/move', ctl.move);
router.post('/:id/checkout', ctl.checkout);

module.exports = router;
