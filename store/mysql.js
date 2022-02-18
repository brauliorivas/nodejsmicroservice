const mysql = require('mysql');

const config = require('../config');

const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
};

let connection;

function handleConn() {
    connection = mysql.createConnection(dbconf);

    connection.connect((err) => {
        if (err) {
            console.error('[db error]', err);
            setTimeout(handleConn, 2000);
        } else {
            console.log('DB Connected');
        }
    });

    connection.on('error', (err) => {
        console.error('[db error]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleConn();
        } else {
            throw err;
        }
    });
}

handleConn();

function list(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        })
    })
}

function get(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        })
    })
}

function insert(table, data) {
    return new Promise((resolve, reject) => {
        console.log(data)
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}

function update(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data, data.id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}

function upsert(table, data) {
    const user = get(table, data.id)
        .then(user => {
            return update(table, data);
        })
        .catch(err => {
            return insert(table, data);
        })
}

function query(table, query, join) {
    let joinQuery = '';
    if (join) {
        const key = Object.keys(join)[0];
        const val = join[key];
        joinQuery = `JOIN ${key} ON ${table}.${val} = ${key}.id`;
    }
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} ${joinQuery} WHERE ${table}.?`, query, (err, res) => {
            if (err) return reject(err);
            resolve(res[0] || null);
        })
    })
}

function listFollowers(table, query) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE ?`, query, (err, res) => {
            if (err) return reject(err);
            const followersId = res.map(row => row.user_from);
            const users = followersId.map(async (id) => {
                const user = await get('user', JSON.stringify(id));
                return user;
            });
            Promise.all(users).then(users => { resolve(users) });
        })
    })
}

module.exports = {
    list,
    get,
    upsert,
    query,
    listFollowers
}