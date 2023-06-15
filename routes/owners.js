const express = require("express")
const {getOwners, getMyPetsPage} = require("../controllers/owners")
const {protect} = require("../utils/protected-route")
const router = express.Router()

router.get("/owners", protect, getOwners)
router.get("/mypets", protect, getMyPetsPage)

module.exports = router
