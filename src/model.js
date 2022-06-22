const Sequelize = require('sequelize');

const { PROFILE_TYPES, JOB_STATUSES } = require('./constants');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3'
});

class Profile extends Sequelize.Model {}
Profile.init(
    {
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        profession: {
            type: Sequelize.STRING,
            allowNull: false
        },
        balance: {
            type: Sequelize.DECIMAL(12, 2)
        },
        type: {
            type: Sequelize.ENUM(...Object.values(PROFILE_TYPES))
        }
    },
    {
        sequelize,
        modelName: 'Profile'
    }
);

class Contract extends Sequelize.Model {}
Contract.init(
    {
        terms: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM(...Object.values(JOB_STATUSES))
        }
    },
    {
        sequelize,
        modelName: 'Contract'
    }
);

class Job extends Sequelize.Model {}
Job.init(
    {
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false
        },
        paid: {
            type: Sequelize.BOOLEAN,
            default: false
        },
        paymentDate: {
            type: Sequelize.DATE
        }
    },
    {
        sequelize,
        modelName: 'Job'
    }
);

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Contract.belongsTo(Profile, { as: 'Contractor' });
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
Contract.belongsTo(Profile, { as: 'Client' });
Contract.hasMany(Job);
Job.belongsTo(Contract);

module.exports = {
    sequelize,
    Profile,
    Contract,
    Job
};
