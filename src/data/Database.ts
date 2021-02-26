import { Connection, createConnection, MysqlError } from "mysql"

class Database {
    private connection: Connection
    private static getDefaultConfig(): any {
        return {
            host: "localhost",
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        }
    }
    constructor(config?) {
        if (config)
            this.connection = createConnection(config);
        else
            this.connection = createConnection(Database.getDefaultConfig())
    }

    async query(sql: string, args: Array<any>): Promise<any> {

        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, function (err: MysqlError, rows) {
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



export { Database }