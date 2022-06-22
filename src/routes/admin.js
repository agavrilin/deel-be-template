const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/best-profession', adminController.bestProfession);

router.get('/best-clients', adminController.bestClients);

module.exports = router;