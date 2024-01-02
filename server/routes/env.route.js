const express = require("express")
const router = express.Router()

const { verifyToken } = require("../Middleware/tokenvalidation")
const envService = require("../controllers/envSevice")
const { fieldvalidation } = require("../Middleware/validation/fieldValidation")
const { ENVFIELDS } = require("../utils/constants/apiFields")


//store the keys and passwords
router.get("/envlist/get", verifyToken, envService.getEnvList)
router.post("/envlist/add", fieldvalidation(ENVFIELDS.ADDENVNAME), verifyToken, envService.addEnvList)
router.delete("/envlist/delete/:envName", verifyToken, envService.deleteEnvname)
router.put("/envlist/update/:envName", fieldvalidation(ENVFIELDS.ADDENVNAME), verifyToken, envService.updateEnvList)
router.post("/envdata/add", fieldvalidation(ENVFIELDS.ADDENVDATA), verifyToken, envService.addEnvData)
router.get("/envdata/list/:envtype", verifyToken, envService.getEnvData)

module.exports = router;