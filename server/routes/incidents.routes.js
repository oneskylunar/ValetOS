const express = require('express');
const ctl = require('../controllers/resources.controller');

const router = express.Router();
router.get('/', ctl.listIncidents);
router.post('/', ctl.createIncident);

module.exports = router;
