const express = require('express');

const secure = require('./secure');
const response = require('../../../network/response');
const controller = require('./index');

const router = express.Router();

const list = (req, res, next) => {
    controller.list()
        .then((lista) => {
            response.success(req, res, lista, 200);
        })
        .catch(next);
};
const get = (req, res, next) => {
    controller.get(req.params.id)
        .then((user) => {
            response.success(req, res, user, 200);
        })
        .catch(next);
};
const upsert = (req, res, next) => {
    controller.upsert(req.body)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next);
};
const remove = (req, res, next) => {
    controller.remove(req.params.id)
        .then((user) => {
            response.success(req, res, user, 200);
        })
        .catch(next);
};

const follow = (req, res, next) => {
    controller.follow(req.user.id, req.params.id) 
        .then(data => {
            response.success(req, res, data, 201);
        })
        .catch(next);
}

const followers = (req, res, next) => {
    controller.followers(req.params.id)
        .then(data => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}

router.get('/', list);
router.post('/follow/:id', secure('follow'), follow);
router.get('/followers/:id', secure('followers'), followers);
router.get('/:id', get);
router.post('/', upsert);
router.delete('/:id', remove);
router.put('/', secure('update'), upsert);

module.exports = router;