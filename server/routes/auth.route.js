const express = require("express")
const router = express.Router()

const { fieldvalidation } = require("../Middleware/validation/fieldValidation")
const { AUTHFIELDS } = require("../utils/constants/apiFields")
const { verifyToken } = require("../Middleware/tokenvalidation")
// const authService = require("../controllers/authServices")
const { CONTROLLERS } = require("../controllers/controller.index")
const { UTILS } = require("../utils/util.index")
const { VALIDATION } = require("../Middleware/validation.index")


// auth module
// signup router
router.post(
    UTILS.CONSTANTS.API_END_POINTS.AUTH.SIGNUP,
    VALIDATION.PAYLOAD_VALIDATION.fieldvalidation(UTILS.CONSTANTS.API_PAYLOADS.AUTH_PAYLOAD.SIGNUP),
    VALIDATION.AUTH_VALIDATION.SIGNUP_VALIDATION,
    CONTROLLERS.AUTH_CONTROLLER.signup(CONTROLLERS)
)
// signin router
router.post(
    UTILS.CONSTANTS.API_END_POINTS.AUTH.SIGNIN,
    fieldvalidation(AUTHFIELDS.SIGNIN),
    CONTROLLERS.AUTH_CONTROLLER.signin
)

// forget password 
router.post("/forgotpassword", fieldvalidation(AUTHFIELDS.FORGETPASS), CONTROLLERS.AUTH_CONTROLLER.forgotpassword(CONTROLLERS))
// router.put("/requestforgotpassword/:email", userService.requestForgotpassword)
router.post("/resetpassword/:token", fieldvalidation(AUTHFIELDS.RESETPASS), CONTROLLERS.AUTH_CONTROLLER.resetpassword)
router.put("/adminChangePassword/:userId", fieldvalidation(AUTHFIELDS.ADMINRESETPASS), verifyToken, CONTROLLERS.AUTH_CONTROLLER.adminChangePassword)
router.get("/refreshtoken/:refreshtoken", CONTROLLERS.AUTH_CONTROLLER.refreshtoken)
router.get('/userlist', verifyToken, CONTROLLERS.AUTH_CONTROLLER.listUsers)
router.get('/detailsbyid/:userId', verifyToken, CONTROLLERS.AUTH_CONTROLLER.userDetailById)
router.delete('/deletebyid/:userId', verifyToken, CONTROLLERS.AUTH_CONTROLLER.deleteUserById)
router.put('/updateDetailbyid/:userId', fieldvalidation(AUTHFIELDS.UPDATEUSERDETAILS), verifyToken, CONTROLLERS.AUTH_CONTROLLER.updateDetailById(CONTROLLERS))
router.get('/reqpasswordlist', verifyToken, CONTROLLERS.AUTH_CONTROLLER.getForgetPassRequests)

router.get('/sse/admin', CONTROLLERS.AUTH_CONTROLLER.adminForgetEvent)
router.get('/sse/updateUserDetailsEvent', CONTROLLERS.AUTH_CONTROLLER.updateUserEvent)
router.get('/sse/updatePasswordEvent', CONTROLLERS.AUTH_CONTROLLER.updatePasswordEvent)

module.exports = router