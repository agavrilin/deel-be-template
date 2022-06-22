const express = require('express');

const { getProfile } = require('./middleware/getProfile');

const balanceController = require('./controllers/balance');
const jobController = require('./controllers/job');
const contractController = require('./controllers/contract');
const adminController = require('./controllers/admin');

const router = express.Router();

router.get('/contracts/:id', getProfile, contractController.getContractById);

router.get('/contracts', getProfile, contractController.getContractsList);

router.get('/jobs/unpaid', getProfile, jobController.unpaid);

router.post('/jobs/:id/pay', getProfile, jobController.pay);

router.post('/balances/deposit/:userId', getProfile, balanceController.deposit);

router.get('/admin/best-profession', adminController.bestProfession);

router.get('/admin/best-clients', adminController.bestClients);

module.exports = router;