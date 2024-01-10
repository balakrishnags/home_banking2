const { returnData } = require("../../utils/common")
const ERROR_MESSAGES = require("../../utils/constants/messages")
const RegEx = require("../../utils/regEx")
const { UTILS } = require("../../utils/util.index")

module.exports = {
    SIGNUP_VALIDATION: (req, res, next) => {
        const { userName, email, userRole, userDob, gender, userPhoneNumber, userPassword } = req.body
        // getting the gender names
        let genderGroup = Object.values(UTILS.CONSTANTS.CONSTFIELDS.GENDERFIELD)

        /**
         * checking the body gender value
         * if the gender is other than gender name list it will through error
         */
        if (!genderGroup.includes(gender.toLowerCase().trim())) {
            return returnData(res, 409, ERROR_MESSAGES.ERROR.GENDERERROR)
        }

        /**
         * validating the phone number, it should be number only
         */
        if (!(RegEx.phone__regEx.test(userPhoneNumber))) {
            return returnData(res, 409, ERROR_MESSAGES.ERROR.VALIDPHONE)
        }

        next()
    }
}