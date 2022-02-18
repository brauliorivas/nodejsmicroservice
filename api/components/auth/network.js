const express = require('express');

const response = require('../../../network/response');
const controller = require('./index');

const router = express.Router();

const login = (req, res) => {
    controller.login(req.body.username, req.body.password)
        .then((token) => {
            response.success(req, res, token, 200);
        })
        .catch(err => {
            response.error(req, res, 'Información inválida', 400);
        });
};

router.post('/login', login);

module.exports = router;