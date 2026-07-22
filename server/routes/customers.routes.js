const express = require('express');
const { listCustomers } = require('../controllers/resources.controller');

const router = express.Router();
router.get('/', listCustomers);

module.exports = router;
