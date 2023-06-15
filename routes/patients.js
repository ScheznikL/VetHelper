const express = require("express")
const {getAddPatientPage, getPatientsPage, addPatient} = require("../controllers/patients")
const {protect} = require("../utils/protected-route")
const router = express.Router()

router.get("/patients", protect, getPatientsPage)

router.get("/patient/new", protect, getAddPatientPage)
router.post("/patient/new", protect, addPatient)

module.exports = router
