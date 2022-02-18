const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');

const config = require('../config');
const user = require('./components/user/network');
const auth = require('./components/auth/network');
const errors = require('../network/errors');

const app = express();

const swaggerDoc = require('./swagger.json');

app.use(bodyParser.json());
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(errors);

app.listen(config.api.port, () => {
    console.log('Api escuchando en el puerto ', config.api.port);
});
