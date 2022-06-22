const express = require('express');

const { getProfile } = require('../middleware/getProfile');

const balanceController = require('../controllers/balance');

const router = express.Router();

router.use(getProfile);

// I guess we don't need to use :userId for deposit endpoint because we already have profile_id in header.
router.post('/deposit/:userId', balanceController.deposit);

module.exports = router;