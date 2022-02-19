const express = require('express');

const response = require('../network/response');
const Store = require('../store/redis');

const router = express.Router();

async function list(req, res, next) {
    const datos = await Store.list(req.params.tabla);
    response.success(req, res, datos, 200); 
}
async function get(req, res, next) {
    const datos = await Store.get(req.params.tabla, req.params.id);
    response.success(req, res, datos, 200); 
}
async function upsert(req, res, next) {
    const datos = await Store.upsert(req.params.tabla, req.body);
    response.success(req, res, datos, 200); 
}

router.get('/:tabla', list);
router.get('/:tabla/:id', get);
router.put('/:tabla', upsert);

module.exports = router;