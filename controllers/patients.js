const {getOwnerByEmail} = require("../models/owners")
const {createNewApplication, getApplicationsList} = require("../models/patients")

exports.getPatientsPage = async (req, res) => {
  const {type, pib, email} = req.user

  const patients = await getApplicationsList(email)

  res.render("patients", {
    title: "Пацієнти | Vet-Helper",
    activePage: "patients",
    user: {
      role: type,
      name: pib
    },
    patients
  })
}

exports.getAddPatientPage = (req, res) => {
  const {type, pib} = req.user

  res.render("patient-new", {
    title: "Додати нового пацієнта | Vet-Helper",
    activePage: "patient-new",
    user: {
      role: type,
      name: pib
    }
  })
}

exports.addPatient = async (req, res) => {
  try {
    const {email} = req.user

    const isRegistered = await getOwnerByEmail(req.body.ownerEmail)
    if (!isRegistered) res.status(401).send("Власник не зареєстрований у системі!")

    const result = await createNewApplication({
      ...req.body,
      veterinarianEmail: email
    })
    console.log("result", result)

    res.status(200).end()
  }
  catch (e) {
    console.log("error", e.message)
    res.status(500).end()
  }
}
