const ENVDATA = {
    baseUrl: process.env.BACKEND_PORT,
    dbport: process.env.DB_PORT,
    jwtsecretkey: process.env.JWTSECRETKEY,
    accesstokenexpiry: process.env.ACCESSTOKENEXPIRYTIME,
    refreshtokenexpiry: process.env.REFRESHTOKENEXPIRETIME,
    forgottokenexpiry: process.env.FORGOTTOKENEXPIRYTIME,
    forgetPasswordlink: process.env.FORGETPASSWORDLINK
}

module.exports = { ENVDATA }