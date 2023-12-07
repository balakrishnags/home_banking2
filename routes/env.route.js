const express = require("express")
const router = express.Router()

const { verifyToken } = require("../Middleware/tokenvalidation")
const envService = require("../controllers/envSevice")


//store the keys and passwords
router.get("/envlist/get", verifyToken, envService.getEnvList)
router.post("/envlist/add", verifyToken, envService.addEnvList)
router.delete("/envlist/delete/:envName", verifyToken, envService.deleteEnvname)
router.put("/envlist/update/:envName", verifyToken, envService.updateEnvList)
router.post("/envdata/add", verifyToken, envService.addEnvData)
router.get("/envdata/list/:envtype", verifyToken, envService.getEnvData)

module.exports = router;