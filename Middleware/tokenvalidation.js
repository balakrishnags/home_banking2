var jwt = require('jsonwebtoken');
const { ENVDATA } = require("../config/config");
const { decryptData, returnData } = require("../utils/common");
const db = require("../database/database");
const ERROR_MESSAGES = require('../utils/constants/messages');

// verify the token
module.exports.verifyToken = async (req, res, next) => {
    try {
        let token = req?.headers?.authorization?.split(" ")[1]
        let data = await jwt.verify(token, ENVDATA.jwtsecretkey);
        let isUser = JSON.parse(decryptData(data.encryptedData))
        // console.log("🚀 ~ file: userservice.js:141 ~ module.exports.verifyToken= ~ isUser:", isUser)
        const isActiveQuery = 'SELECT userRole FROM users WHERE email=? AND status=1'

        db.query(isActiveQuery, [isUser.email], async (err, result) => {
            if (err) {
                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
            }
            if (result.length < 1) {
                return returnData(res, 401, ERROR_MESSAGES.ERROR.UNAUTHORIZED)
                // res.status(401).json({ status: 401, error: "Unauthorized" })
            }
            req.decodedToken = { result: result }
            next()
        })
    }
    catch (error) {
        // console.log("🚀 ~ file: userservice.js:152 ~ module.exports.verifyToken= ~ error:", error)
        return returnData(res, 401, ERROR_MESSAGES.ERROR.TOKENEXPIRED)
        // res.status(401).json({
        //     status: 401,
        //     error: "Token expired"
        // })
    }
}