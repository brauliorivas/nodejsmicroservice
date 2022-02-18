const request = require('request');

function createRemoteDB(host, port) {
    const URL = `http://${host}:${port}`;

    function req(method, table, data) {
        let url = URL + '/' + table;
        body = '';

        if (method === 'GET' && data) {
            url += '/' + data;
        } else if (data) {
            body = JSON.stringify(data);
        }

        return new Promise((resolve, reject) => {
            request({
                method,
                headers: {
                    'content-type': 'application/json'
                },
                url,
                body,
            }, (err, req, res) => {
                if (err) {
                    console.error('Error con la base de datos remota', err);
                    reject(err.message);
                }
                const ress = JSON.parse(res);
                resolve(ress.body);
            })
        })
    }

    function list(table) {
        return req('GET', table);
    }
    function get(table, id) {
        return req('GET', table, id);
    }
    function upsert(table, data) {
        return req('PUT', table, data);
    }
    function insert(table, data) {
        return req('POST', table, data);
    }
    function update(table, data) {
        return req('PUT', table, data);
    }
    function query(table, data) {
        return req('POST', table + '/query', { query, join});
    }
    return {
        list,
        get,
        upsert,
        query
    }
}

module.exports = createRemoteDB;