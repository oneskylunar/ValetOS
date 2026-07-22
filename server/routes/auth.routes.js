const express = require('express');
const ctrl = require('../controllers/auth.controller');

const router = express.Router();
router.post('/login',  ctrl.login);
router.post('/logout', ctrl.logout);
router.get('/me',      ctrl.me);

module.exports = router;
