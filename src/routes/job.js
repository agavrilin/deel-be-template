const express = require('express');

const { getProfile } = require('../middleware/getProfile');

const jobController = require('../controllers/job');

const router = express.Router();

router.use(getProfile);

router.get('/unpaid', jobController.unpaid);

router.post('/:id/pay', jobController.pay);

module.exports = router;
