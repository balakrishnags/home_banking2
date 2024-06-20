const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http');
const server = http.createServer(app);
const { ENVDATA } = require("./config/config")
const { ROUTES } = require("./routes/routes.index");

require("./database/database")

app.use(cors())
app.use(express.json())

app.use(ROUTES.AUTH_ROUTE)
app.use(ROUTES.USER_ROUTE)
app.use(ROUTES.ENV_ROUTE)
// "10.20.121.6",
server.listen(ENVDATA.baseUrl, () => {
    console.log("ENVDATA.baseUrl", ENVDATA.baseUrl);
})