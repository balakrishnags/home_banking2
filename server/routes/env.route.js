const express = require("express")
const router = express.Router()

const { verifyToken } = require("../Middleware/tokenvalidation")
// const envService = require("../controllers/envSevice")
const { fieldvalidation } = require("../Middleware/validation/fieldValidation")
const { ENVFIELDS } = require("../utils/constants/apiFields")
const { CONTROLLERS } = require("../controllers/controller.index")



//store the keys and passwords
router.get("/envlist/get", verifyToken, CONTROLLERS.ENV_CONTROLLER.getEnvList)
router.post("/envlist/add", fieldvalidation(ENVFIELDS.ADDENVNAME), verifyToken, CONTROLLERS.ENV_CONTROLLER.addEnvList)
router.delete("/envlist/delete/:envName", verifyToken, CONTROLLERS.ENV_CONTROLLER.deleteEnvname)
router.put("/envlist/update/:envName", fieldvalidation(ENVFIELDS.ADDENVNAME), verifyToken, CONTROLLERS.ENV_CONTROLLER.updateEnvList)
router.post("/envdata/add", fieldvalidation(ENVFIELDS.ADDENVDATA), verifyToken, CONTROLLERS.ENV_CONTROLLER.addEnvData)
router.get("/envdata/list/:envtype", verifyToken, CONTROLLERS.ENV_CONTROLLER.getEnvData)

module.exports = router;