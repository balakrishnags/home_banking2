const express = require("express");
const router = express.Router()

// const userService = require("../controllers/userservice");
const { fieldvalidation } = require("../Middleware/validation/fieldValidation");
const { verifyToken } = require("../Middleware/tokenvalidation");
const { USERCRUDFIELDS } = require("../utils/constants/apiFields");
const { CONTROLLERS } = require("../controllers/controller.index");
const { UTILS } = require("../utils/util.index");


// role crud operation
router.post(UTILS.CONSTANTS.API_END_POINTS.USER.CREATE_ROLE, verifyToken, CONTROLLERS.USER_CONTROLLER.createrole)
router.put(UTILS.CONSTANTS.API_END_POINTS.USER.UPDATE_ROLE, verifyToken, CONTROLLERS.USER_CONTROLLER.updaterole)
router.get(UTILS.CONSTANTS.API_END_POINTS.USER.GET_ROLE, verifyToken, CONTROLLERS.USER_CONTROLLER.getrolelist)
router.delete(UTILS.CONSTANTS.API_END_POINTS.USER.DELETE_ROLE, verifyToken, CONTROLLERS.USER_CONTROLLER.deleterole)

// credit,debit,lending,payment apis
router.post(UTILS.CONSTANTS.API_END_POINTS.USER.ADD_CREDIT_DEBIT, fieldvalidation(USERCRUDFIELDS.ADDCREDITDEBIT), verifyToken, CONTROLLERS.USER_CONTROLLER.addCreditDebit)
router.put(UTILS.CONSTANTS.API_END_POINTS.USER.UPDATE_CREDIT_DEBIT, fieldvalidation(USERCRUDFIELDS.ADDCREDITDEBIT), verifyToken, CONTROLLERS.USER_CONTROLLER.updateCreditDebit)
router.get(UTILS.CONSTANTS.API_END_POINTS.USER.GET_CREDIT_DEBIT_LIST, verifyToken, CONTROLLERS.USER_CONTROLLER.getCreditDebitList)
router.delete(UTILS.CONSTANTS.API_END_POINTS.USER.DELETE_CREDIT_DEBIT, verifyToken, CONTROLLERS.USER_CONTROLLER.deleteCreditDebitList)

// payment status update API
router.post(UTILS.CONSTANTS.API_END_POINTS.USER.ADD_PAYMENTDETAILS, fieldvalidation(USERCRUDFIELDS.ADDPAYMENTDETAILS), verifyToken, CONTROLLERS.USER_CONTROLLER.addPaymentDetails)
router.put(UTILS.CONSTANTS.API_END_POINTS.USER.UPDATE_PAYMENTDETAILS, fieldvalidation(USERCRUDFIELDS.ADDPAYMENTDETAILS), verifyToken, CONTROLLERS.USER_CONTROLLER.updatePaymentDetails)
router.get(UTILS.CONSTANTS.API_END_POINTS.USER.GET_PAYMENTDETAILS, verifyToken, CONTROLLERS.USER_CONTROLLER.getPaymentDetails)
router.delete(UTILS.CONSTANTS.API_END_POINTS.USER.DELETE_PAYMENTDETAILS, verifyToken, CONTROLLERS.USER_CONTROLLER.deletePaymentDetails)

// get chart data for dashboard
router.get(UTILS.CONSTANTS.API_END_POINTS.USER.CHART_DATA, verifyToken, CONTROLLERS.USER_CONTROLLER.getChartdata)
router.get(UTILS.CONSTANTS.API_END_POINTS.USER.GET_BALANCE, verifyToken, CONTROLLERS.USER_CONTROLLER.getTotalBalance)

module.exports = router;