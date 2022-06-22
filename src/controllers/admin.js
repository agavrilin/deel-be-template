const { col, fn, Op } = require('sequelize');

module.exports = {
    bestProfession,
    bestClients
};

async function bestProfession(req, res, next) {
    try {
        const { Contract, Job, Profile } = req.app.get('models');

        const { start, end } = req.query;
    
        if(!start || !end) {
            return res.status(400).json({
                message: 'start, end query params is required'
            });
        }
    
        const profession = await Profile.findOne({
            attributes: ['profession', [fn('sum', col('Contractor.Jobs.price')), 'earned']],
            where: { type: 'contractor' },
            include: {
                model: Contract,
                as: 'Contractor',
                attributes: [],
                include: {
                    model: Job,
                    attributes: [],
                    where: {
                        paymentDate: { [Op.and]: [{ [Op.gte]: start }, { [Op.lte]: end }] },
                        paid: true,
                    },
    
                }
            },
            group: 'Profile.profession',
            order: [ [ col('earned'), 'DESC' ]],
            subQuery: false
        });
    
        res.json(profession);    
    } catch (err) {
        next(err);
    }
}

async function bestClients(req, res, next) {
    try {
        const { start, end, limit = 2 } = req.query;
        const { Contract, Job, Profile } = req.app.get('models');
        
        if(!start || !end) {
            return res.status(400).json({
                message: 'start, end query params is required'
            });
        }
        
        const clients = await Profile.findAll({
            attributes: ['id', 'firstName', 'lastName', [fn('IFNULL', fn('sum', col('Client.Jobs.price')), 0), 'paid']],
            where: { type: 'client' },
            include: {
                model: Contract,
                as: 'Client',
                attributes: [],
                include: {
                    model: Job,
                    where: {
                        paymentDate: { [Op.and]: [{ [Op.gte]: start }, { [Op.lte]: end }] },
                        paid: true,
                    },
                    attributes: []
                }
            },
            group: 'Profile.profession',
            order: [ [ col('paid'), 'DESC' ]],
            limit,
            offset: 0,
            raw: false,
            subQuery: false
        });
    
        res.json(clients);
    } catch (err) {
        next(err);
    }

}