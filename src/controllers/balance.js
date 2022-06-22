const { fn, col, Op } = require('sequelize');

const { PROFILE_TYPES } = require('../constants');

module.exports = {
    deposit
};

async function deposit (req, res, next) {
    if (req.profile.type === PROFILE_TYPES.CONTRACTOR) {
        return res.sendStatus(401);
    }

    const { amount } = req.body;

    if (!amount || typeof amount !== 'number') {
        return res.status(400).json({
            code: 'validation_error',
            message: 'amount is required and should be a type Number'
        });
    }

    const userId = req.params.userId;
    const sequelize = req.app.get('sequelize');

    const transaction = await sequelize.transaction();

    try {
        const { Contract, Job, Profile } = req.app.get('models');

        const client = await Profile.findOne({
            where: { id: userId },
            attributes: ['id', [fn('sum', col('Client.Jobs.price')), 'amountToPay']],
            include: {
                model: Contract,
                as: 'Client',
                attributes: ['id'],
                include: {
                    model: Job,
                    where: { paid: { [Op.not]: true } }
                }
            },
            subQuery: false,
            lock: transaction.LOCK.UPDATE,
            transaction
        });

        const maxAmount = client.toJSON().amountToPay * 0.25;

        if (amount > maxAmount) {
            await transaction.rollback();
            return res.status(400).json({
                code: 'invalid_amount',
                message: `you can't deposit more than ${maxAmount}`
            });
        }

        await client.increment('balance', { by: amount, transaction });
        await transaction.commit();
    
        return res.sendStatus(204);
    } catch(err) {
        if (transaction) await transaction.rollback();
        next(err);
    }
}