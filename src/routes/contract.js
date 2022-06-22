const express = require('express');

const { getProfile } = require('../middleware/getProfile');

const contractController = require('../controllers/contract');

const router = express.Router();

router.use(getProfile);

router.get('/:id', contractController.getContractById);

router.get('/', contractController.getContractsList);

module.exports = router;
