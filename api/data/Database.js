const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()
const defaultConfig = {
    host: "localhost",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
}

class Database {
    constructor(config) {
        if (config)
            this.connection = mysql.createConnection(config);
        else
            this.connection = mysql.createConnection(defaultConfig)
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(rows)
                }
            })
        })
    }
    close() {
        
        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err)
                    reject(err)
                else
                    resolve()
            })
        })
    }
}



exports.defaultConfig = defaultConfig
exports.Database = Database