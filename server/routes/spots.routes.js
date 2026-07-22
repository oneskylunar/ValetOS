const express = require('express');
const { listSpots, getSpot } = require('../controllers/spots.controller');

const router = express.Router();
router.get('/', listSpots);
router.get('/:id', getSpot);

module.exports = router;
