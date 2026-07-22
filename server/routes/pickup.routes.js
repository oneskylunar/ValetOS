const express = require('express');
const ctl = require('../controllers/pickup.controller');

const router = express.Router();
router.get('/', ctl.listPickup);
router.post('/', ctl.createPickup);
router.put('/:id/status', ctl.updatePickupStatus);

module.exports = router;
