const { Op } = require('sequelize');

const { PROFILE_TYPES, PROFILE_SCOPE, JOB_STATUSES } = require('../constants');

module.exports = {
    unpaid,
    pay
};

async function unpaid(req, res, next) {
    try {
        const { Contract, Job } = req.app.get('models');
        const unpaidJobs = await Job.findAll({
            where: { paid: { [Op.not]: true } },
            include: {
                model: Contract,
                where: { [PROFILE_SCOPE[req.profile.type]]: req.profile.id, status: JOB_STATUSES.IN_PROGRESS },
                attributes: []
            }
        });
    
        return res.json(unpaidJobs);
    } catch (err) {
        next(err);
    }

}

async function pay(req, res, next) {
    if (req.profile.type === PROFILE_TYPES.CONTRACTOR) {
        return res.sendStatus(401);
    }

    const jobId = req.params.id;
    
    const sequelize = req.app.get('sequelize');
    const transaction = await sequelize.transaction();
    try {
        const { Contract, Job, Profile } = req.app.get('models');
        const unpaidJob = await Job.findOne({
            where: { id: jobId },
            include: {
                model: Contract,
                where: { 'ClientId': req.profile.id },
                attributes: ['id'],
                include: [{
                    model: Profile,
                    as: 'Client'
                }, {
                    model: Profile,
                    as: 'Contractor'
                }]
            },
            lock: transaction.LOCK.UPDATE,
            transaction
        });
    
        if (!unpaidJob) {
            await transaction.rollback();
            return res.sendStatus(404);
        }
    
        if (unpaidJob.paid) {
            await transaction.rollback();
            return res.status(400).json({
                code: 'already_paid',
                message: 'this job already paid'
            });
        }
    
        if (unpaidJob.price > unpaidJob.Contract.Client.balance) {
            await transaction.rollback();
            return res.status(400).json({
                code: 'insufficient_funds',
                message: 'not enough money on your balance to pay for this job'
            });
        }
        
        const contractorUpdate = unpaidJob.Contract.Contractor.increment('balance', { by: unpaidJob.price, transaction });
        const clientUpdate = unpaidJob.Contract.Client.decrement('balance', { by: unpaidJob.price, transaction });
        const jobUpdate = unpaidJob.update({ paid: true, paymentDate: new Date() }, { transaction });

        await Promise.all([jobUpdate, clientUpdate, contractorUpdate]);

        await transaction.commit();
        return res.sendStatus(204);
    } catch(err) {
        if (transaction) await transaction.rollback();
        next(err);
    }
}
