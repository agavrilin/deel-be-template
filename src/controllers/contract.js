const { Op } = require('sequelize');

const { PROFILE_SCOPE, JOB_STATUSES } = require('../constants');

module.exports = {
    getContractById,
    getContractsList
};

async function getContractById(req, res, next) {
    try {
        const { Contract } = req.app.get('models');
        const { id } = req.params;

        const contract = await Contract.findOne({
            where: { id, [PROFILE_SCOPE[req.profile.type]]: req.profile.id }
        });
    
        if(!contract) return res.sendStatus(404);
    
        return res.json(contract);
    } catch (err) {
        next(err);
    }
}

async function getContractsList(req, res, next) {
    try {
        const { Contract } = req.app.get('models');
    
        const contracts = await Contract.findAll({
            where: { [PROFILE_SCOPE[req.profile.type]]: req.profile.id, status: { [Op.ne]: JOB_STATUSES.TERMINATED } }
        });
    
        return res.json(contracts);
    } catch (err) {
        next(err);
    }
}
