import { Connection, createConnection, MysqlError } from "mysql"


const dotenv = require('dotenv')
dotenv.config()
const defaultConfig = {
    host: "localhost",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
}

class Database {
    private connection: Connection
    constructor(config?) {
        if (config)
            this.connection = createConnection(config);
        else
            this.connection = createConnection(defaultConfig)
    }

    async query(sql: string, args: Array<any>): Promise<any> {
        
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, function(err: MysqlError, rows) {
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
                    resolve(null)
            })
        })
    }
}



export {defaultConfig, Database}