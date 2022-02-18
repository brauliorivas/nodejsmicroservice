module.exports = {
    api: {
        port: process.env.API_PORT || 3000,
    },
    post: {
        port: process.env.POST_PORT || 3002,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'notasecret',
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'sql10.freemysqlhosting.net',
        user: process.env.MYSQL_USER || 'sql10472844',
        password: process.env.MYSQL_PASS || '5rmSiZLtUH',
        database: process.env.MYSQL_DB || 'sql10472844',
    },
    mysqlService: {
        host: process.env.MYSQL_SERVICE_HOST || 'localhost',
        port: process.env.MYSQL_SERVICE_PORT || 3001,
    }
}