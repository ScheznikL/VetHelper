const {addOwner, getOwnerByCredentials} = require("../models/owners")
const {isVeterinarianExist, addVeterinarian} = require("../models/veterinarian")
const jwt = require("jsonwebtoken")
const {SECRET} = require("../utils/protected-route")

exports.getAuthPage = (req, res) => {
  res.render("auth", {
    title: "Аутентифікація | Vet-Helper"
  })
}

exports.handleOwnerLogin = async (req, res) => {
  const {email, password} = req.query

  const user = await getOwnerByCredentials(email, password)

  if (user) {
    const token = jwt.sign({email, type: "owner"}, SECRET)
    res
      .setHeader("Set-Cookie", [
        `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}; Secure=True;`
      ])
      .status(200)
      .end()
  }
  else res.status(401).end()
}

exports.handleOwnerRegister = async (req, res) => {
  const {pib, email, password} = req.query

  try {
    await addOwner(email, password, pib)

    const token = jwt.sign({email, type: "owner"}, SECRET)
    res
      .setHeader("Set-Cookie", [
        `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}; Secure=True;`
      ])
      .status(200)
      .end()
  }
  catch (e) {
    console.log("error", e.message)
    res.status(500).end()
  }
}

exports.handleVeterinarianLogin = async (req, res) => {
  const {email, password} = req.query

  const user = await isVeterinarianExist(email, password)

  if (user) {
    const token = jwt.sign({email, type: "veterinarian"}, SECRET)
    res
      .setHeader("Set-Cookie", [
        `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}; Secure=True;`
      ])
      .status(200)
      .end()
  }
  else res.status(401).end()
}

exports.handleVeterinarianRegister = async (req, res) => {
  const {pib, position, email, password} = req.query

  try {
    await addVeterinarian(email, password, pib, position)

    const token = jwt.sign({email, type: "veterinarian"}, SECRET)
    res
      .setHeader("Set-Cookie", [
        `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}; Secure=True;`
      ])
      .status(200)
      .end()
  }
  catch (e) {
    console.log("error", e.message)
    res.status(500).end()
  }
}

exports.logout = (req, res) => {
  try {
    res.clearCookie("token").status(200).end()
  }
  catch (e) {
    res.status(500).end()
  }
}
