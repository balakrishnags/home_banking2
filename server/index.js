const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http');
const server = http.createServer(app);
const { ENVDATA } = require("./config/config")
const authRouter = require("./routes/auth.route")
const credRouter = require("./routes/user.route")
const envRouter = require("./routes/env.route")
// const { default: mongoose } = require("mongoose")
require("./database/database")
// const crypto = require('node:crypto')

// console.log(crypto.randomBytes(32).toString('hex'))
// console.log(crypto.)

app.use(cors())
app.use(express.json())

app.use(authRouter)
app.use(credRouter)
app.use(envRouter)

server.listen(ENVDATA.baseUrl, () => {
    console.log("ENVDATA.baseUrl", ENVDATA.baseUrl);
})