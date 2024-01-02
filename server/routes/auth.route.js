const express = require("express")
const router = express.Router()

const { fieldvalidation } = require("../Middleware/validation/fieldValidation")
const { AUTHFIELDS } = require("../utils/constants/apiFields")
const { verifyToken } = require("../Middleware/tokenvalidation")
const authService = require("../controllers/authServices")

// auth module
router.post("/signup", fieldvalidation(AUTHFIELDS.SIGNUP), authService.signup)
router.post("/signin", fieldvalidation(AUTHFIELDS.SIGNIN), authService.signin)
router.post("/forgotpassword", fieldvalidation(AUTHFIELDS.FORGETPASS), authService.forgotpassword)
// router.put("/requestforgotpassword/:email", userService.requestForgotpassword)
router.post("/resetpassword/:token", fieldvalidation(AUTHFIELDS.RESETPASS), authService.resetpassword)
router.put("/adminChangePassword/:userId", fieldvalidation(AUTHFIELDS.ADMINRESETPASS), verifyToken, authService.adminChangePassword)
router.get("/refreshtoken/:refreshtoken", authService.refreshtoken)
router.get('/userlist', verifyToken, authService.listUsers)
router.get('/detailsbyid/:userId', verifyToken, authService.userDetailById)
router.delete('/deletebyid/:userId', verifyToken, authService.deleteUserById)
router.put('/updateDetailbyid/:userId', fieldvalidation(AUTHFIELDS.UPDATEUSERDETAILS), verifyToken, authService.updateDetailById)
router.get('/reqpasswordlist', verifyToken, authService.getForgetPassRequests)
// router.get('/sse', authService.sse)
router.get('/sse/admin', authService.adminForgetEvent)
router.get('/sse/updateUserDetailsEvent', authService.updateUserEvent)
router.get('/sse/updatePasswordEvent', authService.updatePasswordEvent)

module.exports = router