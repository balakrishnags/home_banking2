const express = require("express");
const router = express.Router()

const userService = require("../controllers/userservice");
const { fieldvalidation } = require("../Middleware/validation/fieldValidation");
const { verifyToken } = require("../Middleware/tokenvalidation");
const { USERCRUDFIELDS } = require("../utils/constants/apiFields");

// role crud operation
router.post("/createrole", verifyToken, userService.createrole)
router.put("/updaterole/:roleId", verifyToken, userService.updaterole)
router.get("/getrolelist", verifyToken, userService.getrolelist)
router.delete("/deleterole/:roleId", verifyToken, userService.deleterole)

// credit,debit,lending,payment apis
router.post("/creditdebit/add", fieldvalidation(USERCRUDFIELDS.ADDCREDITDEBIT), verifyToken, userService.addCreditDebit)
router.put("/creditdebit/update/:dataId", fieldvalidation(USERCRUDFIELDS.ADDCREDITDEBIT), verifyToken, userService.updateCreditDebit)
router.get("/creditdebit/getlist/:type/:userId", verifyToken, userService.getCreditDebitList)
router.delete("/creditdebit/deletelist/:type/:dataId", verifyToken, userService.deleteCreditDebitList)

// payment status update API
router.post("/payment/add", fieldvalidation(USERCRUDFIELDS.ADDPAYMENTDETAILS), verifyToken, userService.addPaymentDetails)
router.put("/payment/update/:payId", fieldvalidation(USERCRUDFIELDS.ADDPAYMENTDETAILS), verifyToken, userService.updatePaymentDetails)
router.get("/payment/getlist/:userId/:lendingId/:type", verifyToken, userService.getPaymentDetails)
router.delete("/payment/delete/:userId/:lendingId/:payId/:type", verifyToken, userService.deletePaymentDetails)

// get chart data for dashboard
router.get("/chartdata/:userId/:monthoryear/:date", verifyToken, userService.getChartdata)

module.exports = router;