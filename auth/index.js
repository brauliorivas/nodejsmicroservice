const jwt = require('jsonwebtoken');
const error = require('../utils/error');

const config = require('../config');
const secret = config.jwt.secret;

const sign = (data) => {
    return jwt.sign(data, secret);
} 

const verify = (token) => {
    return jwt.verify(token, secret);
}

const getToken = (auth) => {
    if (!auth) {
        throw new Error('No viene token');
    } 

    if (auth.indexOf('Bearer') === -1) {
        throw new Error('Formato inválido');
    }

    let token = auth.replace('Bearer ', '');

    return token;
} 

const decodeHeader = (req) => {
    const authorization = req.headers.authorization || '';
    const token = getToken(authorization);
    const decoded = verify(token);

    req.user = decoded;

    return decoded;
}

const check = {
    own: (req, owner) => {
        const decoded = decodeHeader(req);

        if (decoded.id !== owner ) {
            throw error('No puedes hacer esto', 401);
        } 
    },
    logged: (req, owner) => {
        const decoded = decodeHeader(req);
    }
}

module.exports = {
    sign,
    check
};