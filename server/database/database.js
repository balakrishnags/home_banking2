const mysql = require("mysql")
const { ENVDATA } = require("../config/config")

const connection = mysql.createConnection({
    port: ENVDATA.dbport,
    host: '127.0.0.1',
    user: "root",
    password: "Balu@8722",
    database: 'home_banking',
    multipleStatements: true
})

connection.connect((err) => {
    if (err) throw err
    console.log("database connected")
})

module.exports = connection;