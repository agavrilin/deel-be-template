const express = require('express');
const bodyParser = require('body-parser');

const { sequelize } = require('./model');
const router = require('./routes');

const app = express();
app.use(bodyParser.json());

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(router);

app.use((req, res) => {
    return res.sendStatus(404);
});

app.use((err, req, res) => {
    console.error(err.message, err.stack);

    return res.status(500).json({
        code: 'internal_service_error',
        message: err.message
    });
});

module.exports = app;