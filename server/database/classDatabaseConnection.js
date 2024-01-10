const mysql = require("mysql");
const { ENVDATA } = require("../config/config");

class databseFunction {
    db = null;
    dbConfig = {}

    getDBConfig() {
        return this.dbConfig
    }

    setDBConfig(configObj) {
        this.dbConfig = configObj
    }

    connect() {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(this.getDBConfig())
            connection.connect((err) => {
                if (err) {
                    reject("db connection error")
                }
                resolve("database connected====");
                this.db = connection
            })
        })

    }

    close() {
        return new Promise((resolve, reject) => {
            this.db?.end((err) => {
                if (err) {
                    reject(err)
                }
                resolve("")
            })
        })
    }

    executeQuery(query, values) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.connect()

                this.db.query(query, values, (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })

            } catch (err) {
                reject(err)
            } finally {
                await this.close()
            }
        })

    }
}

const mySQLInstance = new databseFunction();

mySQLInstance.setDBConfig({
    port: ENVDATA.dbport,
    host: '127.0.0.1',
    user: "root",
    password: "Balu@8722",
    database: 'home_banking',
    multipleStatements: true
})

module.exports = mySQLInstance;