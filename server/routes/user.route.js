const express = require("express");
const router = express.Router()

// const userService = require("../controllers/userservice");
const { fieldvalidation } = require("../Middleware/validation/fieldValidation");
const { verifyToken } = require("../Middleware/tokenvalidation");
const { USERCRUDFIELDS } = require("../utils/constants/apiFields");
const { CONTROLLERS } = require("../controllers/controller.index");


// role crud operation
router.post("/createrole", verifyToken, CONTROLLERS.USER_CONTROLLER.createrole)
router.put("/updaterole/:roleId", verifyToken, CONTROLLERS.USER_CONTROLLER.updaterole)
router.get("/getrolelist", verifyToken, CONTROLLERS.USER_CONTROLLER.getrolelist)
router.delete("/deleterole/:roleId", verifyToken, CONTROLLERS.USER_CONTROLLER.deleterole)

// credit,debit,lending,payment apis
router.post("/creditdebit/add", fieldvalidation(USERCRUDFIELDS.ADDCREDITDEBIT), verifyToken, CONTROLLERS.USER_CONTROLLER.addCreditDebit)
router.put("/creditdebit/update/:dataId", fieldvalidation(USERCRUDFIELDS.ADDCREDITDEBIT), verifyToken, CONTROLLERS.USER_CONTROLLER.updateCreditDebit)
router.get("/creditdebit/getlist/:type/:userId", verifyToken, CONTROLLERS.USER_CONTROLLER.getCreditDebitList)
router.delete("/creditdebit/deletelist/:type/:dataId", verifyToken, CONTROLLERS.USER_CONTROLLER.deleteCreditDebitList)

// payment status update API
router.post("/payment/add", fieldvalidation(USERCRUDFIELDS.ADDPAYMENTDETAILS), verifyToken, CONTROLLERS.USER_CONTROLLER.addPaymentDetails)
router.put("/payment/update/:payId", fieldvalidation(USERCRUDFIELDS.ADDPAYMENTDETAILS), verifyToken, CONTROLLERS.USER_CONTROLLER.updatePaymentDetails)
router.get("/payment/getlist/:userId/:lendingId/:type", verifyToken, CONTROLLERS.USER_CONTROLLER.getPaymentDetails)
router.delete("/payment/delete/:userId/:lendingId/:payId/:type", verifyToken, CONTROLLERS.USER_CONTROLLER.deletePaymentDetails)

// get chart data for dashboard
router.get("/chartdata/:userId/:monthoryear/:date", verifyToken, CONTROLLERS.USER_CONTROLLER.getChartdata)
router.get("/userbalance/:userId", verifyToken, CONTROLLERS.USER_CONTROLLER.getTotalBalance)

module.exports = router;