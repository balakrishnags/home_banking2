const express = require("express")
const router = express.Router()

const { verifyToken } = require("../Middleware/tokenvalidation")
const { fieldvalidation } = require("../Middleware/validation/fieldValidation")
const { ENVFIELDS } = require("../utils/constants/apiFields")
const { CONTROLLERS } = require("../controllers/controller.index")
const { UTILS } = require("../utils/util.index")



//store the keys and passwords
router.get(UTILS.CONSTANTS.API_END_POINTS.ENVLIST.GET_ENVLIST, verifyToken, CONTROLLERS.ENV_CONTROLLER.getEnvList)
router.post(UTILS.CONSTANTS.API_END_POINTS.ENVLIST.ADD_ENVLIST, fieldvalidation(ENVFIELDS.ADDENVNAME), verifyToken, CONTROLLERS.ENV_CONTROLLER.addEnvList)
router.delete(UTILS.CONSTANTS.API_END_POINTS.ENVLIST.DELETE_ENVLIST, verifyToken, CONTROLLERS.ENV_CONTROLLER.deleteEnvname)
router.put(UTILS.CONSTANTS.API_END_POINTS.ENVLIST.UPDATE_ENVLIST, fieldvalidation(ENVFIELDS.ADDENVNAME), verifyToken, CONTROLLERS.ENV_CONTROLLER.updateEnvList)
router.post(UTILS.CONSTANTS.API_END_POINTS.ENVLIST.ADD_ENV_DATA, fieldvalidation(ENVFIELDS.ADDENVDATA), verifyToken, CONTROLLERS.ENV_CONTROLLER.addEnvData)
router.get(UTILS.CONSTANTS.API_END_POINTS.ENVLIST.GET_ENV_DATA, verifyToken, CONTROLLERS.ENV_CONTROLLER.getEnvData)

module.exports = router;