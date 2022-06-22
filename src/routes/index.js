const express = require('express');

const adminRouter = require('./admin');
const jobRouter = require('./job');
const contractRouter = require('./contract');
const balanceRouter = require('./balance');

const router = express.Router();

router.use('/contracts', contractRouter);

router.use('/jobs', jobRouter);

router.use('/balances', balanceRouter);

router.use('/admin', adminRouter);

module.exports = router;
