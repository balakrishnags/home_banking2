var jwt = require('jsonwebtoken');
const { ENVDATA } = require("../config/config");
const { decryptData, returnData } = require("../utils/common");
const ERROR_MESSAGES = require('../utils/constants/messages');
const mySQLInstance = require('../database/classDatabaseConnection');
const userQueries = require('../database/queries/userqueries');

// verify the token
module.exports.verifyToken = async (req, res, next) => {
    try {
        // retrieving token
        let token = req?.headers?.authorization?.split(" ")[1]
        // decrypting the token and parsing the data
        let data = await jwt.verify(token, ENVDATA.jwtsecretkey);
        let isUser = JSON.parse(decryptData(data.encryptedData))

        /**
         * checking the user is exist or not by email
         */
        mySQLInstance.executeQuery(userQueries.userRoleQuery, [isUser.email]).then(result => {
            if (result.length < 1) {
                return returnData(res, 401, ERROR_MESSAGES.ERROR.UNAUTHORIZED)
            }
            /**
             * including the result in req body to further usage
             */
            req.decodedToken = { result: result }
            next()
        }).catch(err => {
            return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        })
    }
    catch (error) {
        // token expired, throwing the error
        return returnData(res, 401, ERROR_MESSAGES.ERROR.TOKENEXPIRED)
    }
}