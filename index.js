const express = require("express")
const app = express()
const cors = require("cors")
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


// const url = 'mongodb://127.0.0.1:27017/beTest'
// mongoose.connect(url, {
//     useNewUrlParser: true
// })
// mongoose.connection.on("open", () => {
//     console.log("Mongoodb connected");
// })

app.listen(ENVDATA.baseUrl, () => {
    console.log("ENVDATA.baseUrl", ENVDATA.baseUrl);
})