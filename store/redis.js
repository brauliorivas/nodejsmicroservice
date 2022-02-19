const Redis = require('ioredis');
const config = require('../config');

const redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
});

function list(table) {
    return new Promise((resolve, reject) => {
        redis.get(table, (err, data) => {
            if (err) return reject(err);

            let res = data || null;
            if (data) {
                res = JSON.parse(data)
            }
            resolve(res);
        })
    });
}
function get(table, id) {
    let key = `${table}_${id}`;

    return new Promise((resolve, reject) => {
        redis.get(key, (err, data) => {
            if (err) return reject(err);

            let res = data || null;
            if (data) {
                res = JSON.parse(data)
            }
            resolve(res);
        })
    })
}
function upsert(table, data) {
    let key = table;
    if (data && data.id) {
        key = `${key}_${data.id}`;
    }

    redis.setex(key, 10, JSON.stringify(data));
    return true;
}

module.exports = {
    list,
    get,
    upsert,
};