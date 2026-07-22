const express = require('express');
const ctl = require('../controllers/resources.controller');

const router = express.Router();
router.get('/', ctl.listValets);
router.get('/:id', ctl.getValet);

module.exports = router;
