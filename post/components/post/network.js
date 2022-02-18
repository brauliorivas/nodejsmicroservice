const express = require('express');

const response = require('../../../network/response');
const controller = require('./index');

const router = express.Router();

function list(req, res, next) {
    controller.list()
        .then(data => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}

router.get('/', list);
// añadir
// get(id)
// editar(post)

module.exports = router;